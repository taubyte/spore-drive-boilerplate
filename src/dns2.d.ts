declare module "dns2" {
  interface DnsResponse {
    header: { id: number; rcode: number; qdcount: number; ancount: number; nscount: number };
    answers?: Array<{ name: string; type: number }>;
    authorities?: Array<{ name: string; type: number }>;
  }
  class DNS {
    resolve(hostname: string, type: string): Promise<DnsResponse>;
  }
  export default DNS;
}
