// Method decorator
// Check for the existence of a property within an object.
// If property exist and Boolean(property) - call original function
// If property doesn't exist - print error in console
// Developed for avoiding a same type of code(never was used)

// Example without decorator:
// class SomeComponent {
//   enabled: false;
//   isExist: false;
//   value = 10;
//   setValue() {
//     if (!this.enabled) { return; }
//     if (!this.isExist) { return; }

//     value = 50;
//   }
// }

// Example with decorator:

// @RequiredParam('enabled')
// @RequiredParam('isExist')
// setValue() {
//   value = 50;
// }

export function RequiredParam(propertyName: string, requiredType?: 'string' | 'boolean' | 'number'): Function {
  return function (targetClass: Object, functionName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        if (typeof this[propertyName] === 'undefined') { 
            console.error(`: Can't find ${propertyName} in object`);
            return;
        }

        if (requiredType && typeof this[propertyName] !== requiredType) {
          console.error(`: ${propertyName} is expected to be a ${requiredType}, but ${typeof this[propertyName]} was provided`);
          return;
        }

        if (this[propertyName]) {
          return originalMethod.apply(this, args);
        }
    };

    return descriptor;
  };
}
