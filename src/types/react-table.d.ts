import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    cellAlign?: "left" | "center" | "right";
    headerAlign?: "left" | "center" | "right";
  }
}