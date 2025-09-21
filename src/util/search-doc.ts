import axios, { type AxiosResponse } from "axios";
import _ from "lodash";

import env from "../env.js";

interface Hierarchy {
  lvl0: string;
  lvl1?: string;
  lvl2?: string;
  lvl3?: string;
  lvl4?: string;
  lvl5?: unknown;
  lvl6?: unknown;
}

interface Level {
  matchLevel: string;
  value: string;
}

interface Hierarchy2 {
  lvl1: Level;
  lvl2: Level;
  lvl3: Level;
  lvl4: Level;
}

interface SnippetResult {
  hierarchy: Hierarchy2;
}

interface HLevel {
  fullyHighlighted?: boolean;
  matchLevel: string;
  matchedWords: unknown[];
  value: string;
}

interface Hierarchy3 {
  lvl0: HLevel;
  lvl1: HLevel;
  lvl2: HLevel;
  lvl3: HLevel;
  lvl4: HLevel;
}

interface HierarchyCamel {
  lvl0: HLevel;
  lvl1: HLevel;
  lvl2: HLevel;
  lvl3: HLevel;
  lvl4: HLevel;
}

interface HighlightResult {
  hierarchy: Hierarchy3;
  hierarchy_camel: HierarchyCamel[];
}

interface Hit {
  _highlightResult: HighlightResult;
  _snippetResult: SnippetResult;
  content?: unknown;
  hierarchy: Hierarchy;
  objectID: string;
  type: string;
  url: string;
}

interface Result {
  exhaustiveNbHits: boolean;
  hits: Hit[];
  hitsPerPage: number;
  index: string;
  nbHits: number;
  nbPages: number;
  page: number;
  params: string;
  processingTimeMS: number;
  query: string;
  renderingContent: unknown;
}

interface DocResponse {
  results: Result[];
}

interface IDocResults {
  name: string;
  value: string;
}

export async function SearchDoc(input: string): Promise<IDocResults[]> {
  const response = await axios
    .post<unknown, AxiosResponse<DocResponse>>(
      `https://${env.ALGOLIA_APPLICATION_ID}-dsn.algolia.net/1/indexes/*/queries`,
      {
        requests: [
          {
            indexName: "discordx",
            query: input,
          },
        ],
      },
      {
        params: {
          "x-algolia-api-key": env.ALGOLIA_API_KEY,
          "x-algolia-application-id": env.ALGOLIA_APPLICATION_ID,
        },
      },
    )
    .then((res) => res.data)
    .catch(() => null);

  if (!response?.results[0]?.hits[0]) {
    return [];
  }

  const results: (IDocResults | null)[] = response.results[0]?.hits.map(
    (hit) => {
      const title =
        `${hit.hierarchy.lvl0}${
          hit.hierarchy.lvl1 ? `#${hit.hierarchy.lvl1}` : ""
        }` +
        (hit.hierarchy.lvl2 ? `#${hit.hierarchy.lvl2}` : "") +
        (hit.hierarchy.lvl3 ? `#${hit.hierarchy.lvl3}` : "") +
        (hit.hierarchy.lvl4 ? `#${hit.hierarchy.lvl4}` : "").slice(0, 99);

      if (!title.length || !hit.url.length || hit.url.length > 99) {
        return null;
      }

      return {
        name: title,
        value: hit.url,
      };
    },
  );

  return _.compact(results);
}
