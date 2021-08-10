class FormModel {

  constructor(types, values) {
    const formModel = this;
    Object.entries(types).forEach(([key,type], i) => {
      formModel[key] = {
        type:    type,
        default: values[key],
      };
    });
  }

}

exports.FormModel = FormModel;
