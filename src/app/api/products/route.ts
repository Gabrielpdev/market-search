import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export interface IProduct {
  productName: null | string;
  price: null | number;
  img: string;
  market: string;
  // promoPrice?: null | number;
  // priceTotalUnit?: null | number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("search");

  if (!query)
    return NextResponse.json(
      { error: "No product query provided" },
      { status: 400 }
    );

  const [kompraoProducts, giassiProducts] = await Promise.all([
    getProductsOnKomprao(query),
    getProductsOnGiassi(query),
  ]);

  const allData = [...kompraoProducts, ...giassiProducts];

  const sortedData = allData
    .filter(
      (product) =>
        product?.productName?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    )
    .sort((a, b) => {
      if (a.productName && b.productName && a.price && b.price) {
        return (
          a.productName.toLowerCase().indexOf(query.toLowerCase()) -
            b.productName.toLowerCase().indexOf(query.toLowerCase()) ||
          a.price - b.price
        );
      }

      return 0;
    });

  return NextResponse.json({ data: sortedData }, { status: 200 });
}

async function getProductsOnKomprao(search: string) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  let page = await browser.newPage();

  const response = await page.goto(
    `https://www.superkoch.com.br/catalogsearch/result/?q=${search}`,
    { waitUntil: "domcontentloaded" }
  );
  const chain = response?.request().redirectChain();

  if (chain && chain.length === 1) {
    const url = chain[0].url();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const products = [];
    let productObj: IProduct = {
      productName: null,
      price: null,
      market: "Komprao",
      img: "/no-image.png",
    };

    const [price, productName, img] = await Promise.allSettled([
      page.$eval(".price", (el) => el.textContent || "N/A"),
      page.$eval(".page-title", (el) => el.textContent || "N/A"),
      page.$eval(".fotorama__stage__frame", (el) => {
        console.log(el);
        return el.getAttribute("href") || "/no-image.png";
      }),
    ]);

    if (productName.status === "fulfilled") {
      productObj.productName = productName.value;
    } else {
      productObj.productName = null;
    }

    if (price.status === "fulfilled") {
      productObj.price = productObj.price = Number(
        price.value.replace(/[^0-9,-]+/g, "").replace(",", ".")
      );
    } else {
      productObj.price = null;
    }

    if (img.status === "fulfilled") {
      productObj.img = img.value;
    } else {
      productObj.img = "/no-image.png";
    }

    products.push(productObj);

    await browser.close();

    return products;
  }

  const productList = await page.$$(".product-item");
  const products = [];

  for (let product of productList) {
    let productObj: IProduct = {
      productName: null,
      price: null,
      img: "/no-image.png",
      market: "Komprao",
    };

    const [price, productName, img] = await Promise.allSettled([
      product.$eval(".price", (el) => el.textContent),
      product.$eval(".product-item-link", (el) => el.textContent),
      product.$eval(
        ".product-image-photo",
        (el) => el.getAttribute("src") || "/no-image.png"
      ),
    ]);

    if (productName.status === "fulfilled") {
      productObj.productName = productName.value;
    } else {
      productObj.productName = null;
    }

    if (price.status === "fulfilled" && price.value) {
      productObj.price = Number(
        price.value.replace(/[^0-9,-]+/g, "").replace(",", ".")
      );
    } else {
      productObj.price = null;
    }

    if (img.status === "fulfilled") {
      productObj.img = img.value;
    } else {
      productObj.img = "/no-image.png";
    }

    products.push(productObj);
  }

  await browser.close();

  return products;
}

async function getProductsOnGiassi(search: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.giassi.com.br/${search}?map=ft&_q=${search}`);

  const productList = await page.$$(".vtex-search-result-3-x-galleryItem");
  const products = [];

  for (let product of productList) {
    let productObj: IProduct = {
      market: "Giassi",
      productName: null,
      price: null,
      img: "/no-image.png",
    };

    const [brand, price, promo, img, priceTotalUnit] = await Promise.allSettled(
      [
        product.$eval(
          ".vtex-product-summary-2-x-productBrand",
          (el) => el.textContent
        ),
        product.$eval(
          ".giassi-apps-custom-0-x-priceUnit",
          (el) => el.textContent
        ),
        product.$eval(
          ".giassi-apps-custom-0-x-pricePerKG",
          (el) => el.textContent
        ),
        product.$eval(
          ".vtex-product-summary-2-x-imageNormal",
          (el) => el.getAttribute("src") || "/no-image.png"
        ),
        product.$eval(
          ".giassi-apps-custom-0-x-priceTotalUnit",
          (el) => el.textContent
        ),
      ]
    );

    if (brand.status === "fulfilled") {
      productObj.productName = brand.value;
    } else {
      productObj.productName = null;
    }

    if (price.status === "fulfilled" && price.value) {
      productObj.price = Number(
        price.value.replace(/[^0-9,-]+/g, "").replace(",", ".")
      );
    } else {
      productObj.price = null;
    }

    if (img.status === "fulfilled") {
      productObj.img = img.value;
    } else {
      productObj.img = "/no-image.png";
    }

    if (priceTotalUnit.status === "fulfilled" && priceTotalUnit.value) {
      productObj.price = Number(
        priceTotalUnit.value.replace(/[^0-9,-]+/g, "").replace(",", ".")
      );
    }

    if (promo.status === "fulfilled" && promo.value) {
      productObj.price = Number(
        promo.value.replace(/[^0-9,-]+/g, "").replace(",", ".")
      );
    }

    products.push(productObj);
  }

  await browser.close();

  return products;
  // .sort((a, b) => {
  //   if (a.productName && b.productName)
  //     return (
  //       a.productName.toLowerCase().indexOf(search.toLowerCase()) -
  //       b.productName.toLowerCase().indexOf(search.toLowerCase())
  //     );
  // });
}
