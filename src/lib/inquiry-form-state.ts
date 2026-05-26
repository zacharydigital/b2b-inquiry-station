type InquiryControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function getControls(form: HTMLFormElement): InquiryControl[] {
  return Array.from(form.querySelectorAll<InquiryControl>('[data-error-target]'));
}

function getErrorElement(form: HTMLFormElement, name: string): HTMLElement | null {
  return form.querySelector<HTMLElement>(`[data-field-error="${name}"]`);
}

function formatFieldName(name: string): string {
  return name
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getControlLabel(input: InquiryControl): string {
  return input.dataset.errorLabel || formatFieldName(input.name);
}

export function syncInquiryConditionalFields(form: HTMLFormElement): void {
  form.querySelectorAll<HTMLElement>('[data-conditional-field]').forEach((wrapper) => {
    const fieldName = wrapper.dataset.visibleWhenField || '';
    const allowedValues = (wrapper.dataset.visibleWhenValues || '').split('|').filter(Boolean);
    const controller = form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${fieldName}"]`);
    const shouldShow = !!controller && allowedValues.includes(controller.value);

    wrapper.classList.toggle('hidden', !shouldShow);
    wrapper.querySelectorAll<InquiryControl>('input, textarea, select').forEach((input) => {
      input.disabled = !shouldShow;
      if (!shouldShow && input.type !== 'file') input.value = '';
      if (!shouldShow) {
        input.removeAttribute('aria-invalid');
        getErrorElement(form, input.name)?.classList.add('hidden');
      }
    });
  });
}

function setFieldValidity(form: HTMLFormElement, input: InquiryControl): boolean {
  const isValid = input.disabled || input.checkValidity();
  const error = getErrorElement(form, input.name);

  input.setAttribute('aria-invalid', String(!isValid));
  if (error) error.classList.toggle('hidden', isValid);

  return isValid;
}

function hideFormErrorSummary(form: HTMLFormElement): void {
  const summary = form.querySelector<HTMLElement>('[data-form-error-summary]');
  summary?.classList.add('hidden');
}

function showFormErrorSummary(form: HTMLFormElement): void {
  const invalidFields = getControls(form).filter((input) => !setFieldValidity(form, input));
  const summary = form.querySelector<HTMLElement>('[data-form-error-summary]');
  const message = form.querySelector<HTMLElement>('[data-form-error-message]');

  if (!summary || invalidFields.length === 0) return;

  if (message) {
    const labels = invalidFields.slice(0, 4).map(getControlLabel);
    const suffix = invalidFields.length > 4 ? ` and ${invalidFields.length - 4} more` : '';
    message.textContent = `Please complete: ${labels.join(', ')}${suffix}.`;
  }

  summary.classList.remove('hidden');
  summary.focus({ preventScroll: true });
}

function setSubmittingState(form: HTMLFormElement): void {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');

  if (button) {
    button.disabled = true;
    button.textContent = 'Submitting...';
    button.classList.add('opacity-75', 'cursor-wait');
  }
  if (status) status.classList.remove('hidden');
}

export function initInquiryFormState(form: HTMLFormElement): void {
  if (form.dataset.formStateReady === 'true') return;
  form.dataset.formStateReady = 'true';

  const syncAndHideSummary = () => {
    syncInquiryConditionalFields(form);
    if (getControls(form).every((input) => input.disabled || input.checkValidity())) {
      hideFormErrorSummary(form);
    }
  };

  form.querySelectorAll<InquiryControl>('select, input, textarea').forEach((field) => {
    field.addEventListener('change', syncAndHideSummary);
    field.addEventListener('input', syncAndHideSummary);
  });

  getControls(form).forEach((field) => {
    field.addEventListener('input', () => {
      if (setFieldValidity(form, field) && getControls(form).every((input) => input.disabled || input.checkValidity())) {
        hideFormErrorSummary(form);
      }
    });
  });

  syncInquiryConditionalFields(form);

  form.addEventListener('submit', (event) => {
    syncInquiryConditionalFields(form);
    if (!form.checkValidity()) {
      event.preventDefault();
      showFormErrorSummary(form);
      form.reportValidity();
      return;
    }

    hideFormErrorSummary(form);
    setSubmittingState(form);
  });
}
