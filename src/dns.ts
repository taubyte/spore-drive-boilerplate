/// <reference path="./dns2.d.ts" />
import dns2 from "dns2";

const SOA_TYPE = 6; // Packet.TYPE.SOA

/**
 * Resolves the zone apex (registered domain) for a hostname via a single SOA query.
 * The SOA owner is taken from the ANSWER section, or from AUTHORITY (e.g. on NXDOMAIN).
 */
export async function resolveZoneApexBySoa(hostname: string): Promise<string> {
  const dns = new dns2();
  const response = await dns.resolve(hostname, "SOA");

  const answers = response.answers || [];
  const authorities = response.authorities || [];

  const soaInAnswers = answers.filter((r: { type: number }) => r.type === SOA_TYPE);
  const soaInAuthorities = authorities.filter(
    (r: { type: number }) => r.type === SOA_TYPE
  );

  const soaRecord = soaInAnswers[0] || soaInAuthorities[0];
  if (!soaRecord || typeof soaRecord.name !== "string") {
    throw new Error(`Could not find zone apex for ${hostname} via SOA`);
  }

  const apex = soaRecord.name.replace(/\.$/, "").toLowerCase();
  return apex;
}
