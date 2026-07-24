declare module "html-to-docx" {
  interface HTMLtoDOCXOptions {
    table?: { row?: { cantSplit?: boolean } };
    footer?: boolean;
    pageNumber?: boolean;
    [key: string]: unknown;
  }

  function HTMLtoDOCX(
    html: string,
    headerHTML?: string,
    options?: HTMLtoDOCXOptions
  ): Promise<Buffer | ArrayBuffer>;

  export default HTMLtoDOCX;
}
