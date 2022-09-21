import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // Create state object for form inpunts
  const [inputs, setInputs] = useState(initial);
  const initialInput = Object.values(initial).join('');

  useEffect(() => {
    setInputs(initial);
  }, [initialInput]);

  function handleChange(event) {
    let { value, name, type } = event.target;

    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = event.target.files;
    }

    setInputs({
      // Copy existing state
      ...inputs,
      [event.target.name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want to surface
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
