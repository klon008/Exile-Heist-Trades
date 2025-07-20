export function Loader() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      <p className="text-lg font-semibold text-foreground">Fetching data from the exiles...</p>
    </div>
  );
}
