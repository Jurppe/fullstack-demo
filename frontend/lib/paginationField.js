import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // Read the number of items on the page
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      
      // First thing it does it asks the read function for those items
      const items = existing.slice(skip, skip + first).filter(item => item);
      // We can either do one of the following things.
      // 1. First things we can do is to return the items because we already have them in cache
      
      // If there are items and there arent enough items to satisfy how many were requested
      // and we are on last page, send the cached items
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      
      // We dont have any items, we must go to the network to fetch them
      if (items.length !== first) {
        return false;
      }
      
      // There are items in cache!
      if (items.length) {
        return items;
      }
      // 2. Second thing we can do is to return false from here (network request),
      // to tell that fetch the data from the original place (database)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the Apollo client comes back from network with the data
      console.log("Merging items from the network");
      const merged = existing ? existing.slice(0) : [];

      for(let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }
      // Finally we return the merged items from the cache
      return merged;
    }
  }
}