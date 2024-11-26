type FunctionProperties<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? {} extends { [P in K]: T[K] }
      ? never
      : K
    : never;
}[keyof T];

type Mock<T> = {
  [K in FunctionProperties<T>]: jasmine.Spy;
};
