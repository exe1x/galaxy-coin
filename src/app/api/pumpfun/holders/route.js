// src/app/api/pumpfun/holders/route.js

export async function GET() {
    const tokenAddress = "FFM66kQBuKQPFnrPDsaEtgdWBJZBbmX9eCet5wbCpump"; // Replace this with the specific token's mint address
    const apiKey = "954a9f74-6dbb-47cc-807c-daa363e99f97"; // Your Helius API key
    const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
  
    let page = 1;
    let allOwners = new Set();
  
    try {
      while (true) {
        // Pagination request payload
        const requestPayload = {
          jsonrpc: "2.0",
          method: "getTokenAccounts",
          id: "helius-test",
          params: {
            page: page,
            limit: 1000,
            mint: tokenAddress,
          },
        };
  
        // Fetch data from Helius API
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });
  
        const data = await response.json();
  
        // Check if there are results
        if (!data.result || data.result.token_accounts.length === 0) {
          console.log(`No more results. Total pages: ${page - 1}`);
          break;
        }
  
        console.log(`Processing results from page ${page}`);
  
        // Add unique owners to the set
        data.result.token_accounts.forEach((account) =>
          allOwners.add(JSON.stringify({ holder: account.owner, amount: account.amount }))
        );
  
        page++;
      }
  
      // Convert Set to Array and parse JSON strings back into objects
      const holdersArray = Array.from(allOwners).map(JSON.parse);
  
      // Log final holders data for verification
      console.log("Final list of token holders:", holdersArray);
  
      return new Response(JSON.stringify(holdersArray), { status: 200 });
    } catch (error) {
      console.error("Error fetching token holders:", error);
      return new Response(null, { status: 500 });
    }
  }
  