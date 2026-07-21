import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('formSubmit');
const submitLabel = submitBtn.querySelector('.form__submit-label');
const status = document.getElementById('formStatus');

form.querySelectorAll('input, select').forEach((field) => {
  field.addEventListener('blur', () => field.classList.add('is-touched'));
});

const isConfigured =
  SUPABASE_URL && !SUPABASE_URL.includes('VOTRE-PROJET') &&
  SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('VOTRE_CLE');

const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function setStatus(message, state) {
  status.textContent = message;
  if (state) {
    status.setAttribute('data-state', state);
  } else {
    status.removeAttribute('data-state');
  }
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitLabel.textContent = loading ? 'Envoi en cours…' : 'Envoyer mon inscription';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('', null);

  if (!form.reportValidity()) {
    form.querySelectorAll('input, select').forEach((field) => field.classList.add('is-touched'));
    return;
  }

  if (!supabase) {
    setStatus(
      "Le formulaire n'est pas encore connecté à la base de données. Configurez js/supabase-config.js.",
      'error'
    );
    return;
  }

  const data = new FormData(form);
  const payload = {
    full_name: data.get('fullName')?.toString().trim(),
    school: data.get('school')?.toString().trim(),
    graduation_year: Number(data.get('graduationYear')),
    nationality: data.get('nationality')?.toString().trim(),
    sector: data.get('sector')?.toString().trim(),
    contact: data.get('contact')?.toString().trim(),
  };

  setLoading(true);

  const { error } = await supabase.from('inscriptions').insert([payload]);

  setLoading(false);

  if (error) {
    console.error(error);
    setStatus("Une erreur est survenue. Merci de réessayer dans un instant.", 'error');
    return;
  }

  setStatus('Inscription enregistrée. Bienvenue dans la communauté !', 'success');
  form.reset();
});
