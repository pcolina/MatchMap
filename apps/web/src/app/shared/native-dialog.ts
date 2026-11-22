export const showDialog = (element: HTMLDialogElement): void => {
  if (typeof element.showModal === 'function') {
    element.showModal();
  } else {
    element.setAttribute('open', '');
  }
};

export const hideDialog = (element: HTMLDialogElement): void => {
  if (typeof element.close === 'function') {
    element.close();
  } else {
    element.removeAttribute('open');
  }
};
