import { jsonrepair } from "jsonrepair";

interface CodeBlock {
  lang: string | null;
  value: string;
  inline: boolean;
}

export async function  extractCodeBlocks(markdown: string): Promise<CodeBlock[]> {
  const [{unified}, visit, remarkParse, remarkRehype, rehypeStringify] = await Promise.all([
    import('unified').then(mod => mod.default || mod),
    import('unist-util-visit').then(mod => mod.visit),
    import('remark-parse').then(mod => mod.default || mod),
    import('remark-rehype').then(mod => mod.default || mod),
    import('rehype-stringify').then(mod => mod.default || mod)
  ]);
  const codeBlocks: CodeBlock[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(() => (tree) => {
      visit(tree, 'code', (node: any) => {
        codeBlocks.push({
          lang: node.lang || null,
          value: node.value,
          inline: false,
        });
      });
      visit(tree, 'inlineCode', (node: any) => {
        codeBlocks.push({
          lang: null,
          value: node.value,
          inline: true,
        });
      });
    })
    .use(remarkRehype)
    .use(rehypeStringify);

  processor.processSync(markdown);

  return codeBlocks;
}

export const getJsonFromOutput = (output:string) => {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    let cleanedJson = jsonMatch ? jsonMatch[0] : null;
    if (cleanedJson) {
        try {
            cleanedJson = jsonrepair(cleanedJson);
            return JSON.parse(cleanedJson||'');
        } catch (error) {
            console.error("Error parsing JSON: ", error);
        }
    } 
    return null;
}
