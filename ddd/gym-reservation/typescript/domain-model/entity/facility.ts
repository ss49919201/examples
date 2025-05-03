const StudioSymbol = Symbol("studio");

interface Studio {
  id: string;
  [StudioSymbol]: null;
}

interface Pool {
  id: string;
}

type Facility = Studio | Pool;
