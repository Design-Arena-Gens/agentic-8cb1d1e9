declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: any);
    }
    namespace places {
      class PlacesService {
        constructor(map: Map);
        textSearch(request: any, callback: (results: any, status: any) => void): void;
      }
      enum PlacesServiceStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
      }
    }
  }
}
