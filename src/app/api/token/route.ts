import { GoogleAuth } from "google-auth-library";

export async function GET() {
  try {
    const auth = new GoogleAuth();
    const projectId = "1005933033433";
    const projectRegion = "southamerica-east1";
    const myFunction = "market-search-api";

    const targetAudience = `https://${projectRegion}-${projectId}.cloudfunctions.net/${myFunction}/`;
    const url = targetAudience;

    console.info(`request ${url} with target audience ${targetAudience}`);
    const client = await auth.getIdTokenClient(targetAudience);

    // Alternatively, one can use `client.idTokenProvider.fetchIdToken`
    // to return the ID Token.
    const token = await client.request({ url });

    return Response.json({
      data: token,
    });
  } catch (error) {
    console.error(error);
    return;
  }
}
