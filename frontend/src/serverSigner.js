import * as fcl from "@onflow/fcl";

const API = "http://localhost:5000";

const getSignature = async (signable) => {
  const response = await fetch(`${API}/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signable })
  });

  const signed = await response.json();
  return signed.signature;
}

export const serverAuthorization = async (account) => {

  const addr = "0x0c60359d10739baa";
  const keyId = 0;

  return {
    ...account,
    tempId: `${addr}-${keyId}`,
    addr: fcl.sansPrefix(addr),
    keyId: Number(keyId),
    signingFunction: async (signable) => {

      const signature = await getSignature(signable);

      return {
        addr: fcl.withPrefix(addr),
        keyId: Number(keyId),
        signature
      }
    }
  }
}