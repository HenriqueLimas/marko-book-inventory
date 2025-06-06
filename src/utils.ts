export type SearchParams = {
  q?: string;
  yr?: string;
  rtg?: string;
  lng?: string;
  isbn?: string;
  page?: string;
  pgs?: string;
};

export function parseSearchParams(url: URL): SearchParams {
  const searchParams = url.searchParams;

  return {
    yr: searchParams.get("yr") || undefined,
    rtg: searchParams.get("rtg") || undefined,
    lng: searchParams.get("lng") || undefined,
    isbn: searchParams.get("isbn") || undefined,
    page: searchParams.get("page") || undefined,
    pgs: searchParams.get("pgs") || undefined,
    q: searchParams.get("q") || undefined
  };
}
