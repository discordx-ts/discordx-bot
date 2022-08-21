import axios from "axios";
import _ from "lodash";

export const MDN_BASE_URL = "https://developer.mozilla.org";

interface MdnAPI {
  documents?: Document[];
  metadata: Metadata;
  suggestions: unknown[];
}

interface Document {
  archived: boolean;
  highlight: Highlight;
  locale: string;
  mdn_url: string;
  popularity: number;
  score: number;
  slug: string;
  summary: string;
  title: string;
}

interface Highlight {
  body: string[];
  title: string[];
}

interface Metadata {
  page: number;
  size: number;
  took_ms: number;
  total: Total;
}

interface Total {
  relation: string;
  value: number;
}

interface IDocResults {
  name: string;
  value: string;
}

export async function searchMDN(input: string): Promise<IDocResults[]> {
  const response = await axios
    .get<MdnAPI>(MDN_BASE_URL + "/api/v1/search", {
      params: {
        q: input,
      },
    })
    .then((res) => res.data)
    .catch(() => null);

  if (!response || !response?.documents) {
    return [];
  }

  const docs = response?.documents;

  const results: (IDocResults | undefined)[] = docs.map((doc) => {
    const title = doc.title.slice(0, 99);
    const url = doc.mdn_url;

    if (!title.length || !url.length || url.length > 99) {
      return;
    }

    return {
      name: title,
      value: url,
    };
  });

  return _.compact(results);
}
