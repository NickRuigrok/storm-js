class Storm {
  constructor() {
    this.container = 'body';
    this.elements = [];
    this.customAttributes = [];
    this.state = {};
  }

  initialize(container = 'body') {
    this.container = container;

    let element, attributes, arr = [];
    const regex = new RegExp('^--', 'i'),
      customAttributes = ['className', 'innerHTML', 'innerText', 'htmlFor'].concat(this.customAttributes),
      elements = document.querySelector(container).getElementsByTagName('*');

    for(let i = 0; i < elements.length; i++) {
      const validAttributes = [];
      element = elements[i];
      attributes = element.attributes;

      for(let j = 0; j < attributes.length; j++) {
        if(regex.test(attributes[j].name)) {
          const currentAttribute = attributes[j].name.replace(/^--/g, '');
          const customAttribute = customAttributes.find(attr => currentAttribute.toLowerCase() === attr.toLowerCase());

          if(currentAttribute === "loop") {
            this.loop(element, attributes[j]);
            validAttributes.push({ name: customAttribute ? customAttribute : currentAttribute, value: attributes[j].value, obj: null });
          } else {
            validAttributes.push({ name: customAttribute ? customAttribute : currentAttribute, value: attributes[j].value.split(':')[1], obj: attributes[j].value.split(':')[0] });
          }

          arr.push({ element: element, attributes: validAttributes });
        }
      }
    }

    elements.length < document.querySelector(container).getElementsByTagName('*') ? this.initialize(container) : null;

    this.elements = arr;

    return this.render(arr);
  }

  loop(element, attribute) {
    let loopCount;
    if(attribute.value.indexOf('@') > -1) {
      const str = attribute.value.replace(/^@/, '');
      loopCount = Number(this.state[str].length);
    } else {
      loopCount = Number(attribute.value);
    }

    const children = Array.from(element.children);
    element.innerHTML = "";

    let loopIndex;
    for(loopIndex = 0; loopIndex < loopCount; loopIndex++) {
      for(let i = 0; i < children.length; i++) {
        const attributes = Array.from(children[i].attributes);
        const clone = children[i].cloneNode(true);
        const regex = new RegExp('^--', 'i');

        const nestedElements = clone.getElementsByTagName('*');
        for(let j = 0; j < nestedElements.length; j++) {
          const nestedAttributes = Array.from(nestedElements[j].attributes);
          for(let k = 0; k < nestedAttributes.length; k++) {
            if(regex.test(nestedAttributes[k].name)) {
              const obj = nestedAttributes[k].value.split(':')[0],
                properties = nestedAttributes[k].value.split(':')[1].split('.');

              const path = properties.join('.').replace(/@/g, loopIndex);

              nestedElements[j].attributes[k].value = `${obj}:${path}`;
            }
          }
        }

        for(let j = 0; j < attributes.length; j++) {
          if(regex.test(attributes[j].name)) {
            const obj = attributes[j].value.split(':')[0],
              properties = attributes[j].value.split(':')[1].split('.');

            const path = properties.join('.').replace(/@/g, loopIndex);

            clone.attributes[j].value = `${obj}:${path}`;
          }
        }
        element.appendChild(clone);
      }
    }
  }

  render(elements) {
    for(let i = 0; i < elements.length; i++) {
      const element = elements[i].element,
        attributes = elements[i].attributes;

      for(let j = 0; j < attributes.length; j++) {
        attributes[j].name.indexOf('data-') === -1
          ? element[attributes[j].name] = this.resolve(attributes[j].value, this.state[attributes[j].obj])
          : element.setAttribute(attributes[j].name, this.resolve(attributes[j].value, this.state[attributes[j].obj]));
        element.removeAttribute(`--${attributes[j].name}`);
      }
    }
  }

  resolve(path, obj = window) {
    const properties = path.split('.');
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
  }

  setState(value) {
    this.state = value;
  }

  store(key, value) {}

  defineAttribute(value) {
    this.customAttributes.push(`data-${value}`);
  }
}

window.Storm = Storm;
