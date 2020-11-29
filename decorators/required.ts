// Property decorator
// Developed for inputs.
// Example: @Required @Input() someProperty;
function Required(targetClass: Object, propertyKey: string) {
  Object.defineProperty(targetClass, propertyKey, {
    get() {
      throw new Error(`Attribute ${propertyKey} is required`);
    },
    set(value) {
      Object.defineProperty(targetClass, propertyKey, { value, writable: true, configurable: true });
    },
  });
}
