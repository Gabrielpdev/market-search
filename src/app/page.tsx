"use client";
import { useRef, useState } from "react";

import Image from "next/image";
import { v4 } from "uuid";

import { IProduct } from "./api/products/route";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const handleList = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/products?search=${inputRef.current?.value}`
      );
      const { data } = await res.json();

      console.log(data);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMarketLogo = (name: string) => {
    if (name === "Komprao") {
      return "/komprao.webp";
    }
    return "/giassi.svg";
  };

  console.log(products);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h3>Pesquise o produto</h3>
      <div className="flex items-center justify-center">
        <input ref={inputRef} className="p-2" type="text" />
        <button
          disabled={loading}
          onClick={handleList}
          className="bg-slate-200 p-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-400 "
        >
          {loading ? (
            <div className="flex items-center justify-center w-24">
              <svg
                className="animate-spin h-7 w-5 "
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 1024 1024"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z"></path>
              </svg>
            </div>
          ) : (
            "Pesquisar"
          )}
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center w-full mt-5">
          <svg
            className="animate-spin h-20 w-20 mr-3"
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 1024 1024"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z"></path>
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-10	auto-cols-max gap-2 p-7 w-full">
          {products.map((product) => (
            <button
              className=" bg-white rounded flex items-center justify-start flex-col pt-3 pb-3"
              key={v4()}
            >
              <h3
                className={`max-w-40 font-bold text-center ${
                  product.market === "Komprao"
                    ? "text-red-500"
                    : "text-orange-500"
                } `}
              >
                <Image
                  className="mb-3"
                  src={getMarketLogo(product.market)}
                  alt={product.market}
                  width={120}
                  height={120}
                />
              </h3>
              <Image
                src={product.img}
                alt={product.productName || ""}
                width={120}
                height={120}
              />
              <h3 className="max-w-40 font-bold  text-center">
                {product.productName}
              </h3>
              <p className="text-white text-2xl font-bold text-center mt-auto bg-green-800 px-2 py-1 rounded-lg">
                {`R$ ${product.price?.toLocaleString("PT-br")}`}
              </p>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
