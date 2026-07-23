
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverFetch = async (path)=>{
   const res = await fetch(`${baseUrl}${path}`);
    return res.json();
}

export const serverMutatoion = async (path, data, method = "POST")=>{
    const res = await fetch(`${baseUrl}${path}`, {
      method: method,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return res;
}