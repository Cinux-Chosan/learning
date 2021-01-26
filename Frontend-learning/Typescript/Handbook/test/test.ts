type ReturnedType<T extends (...args: any[]) => infer R> = R;
