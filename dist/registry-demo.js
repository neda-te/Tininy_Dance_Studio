// САМО СИНТЕТИЧНИ ДАННИ. Няма localStorage, мрежови заявки или реални ученици.
const examples = () => [
  {id: 'DEMO-001', child: 'Примерно дете А', group: 'До 7 години', status: 'new'},
  {id: 'DEMO-002', child: 'Примерно дете Б', group: '7–12 години', status: 'active'},
  {id: 'DEMO-003', child: 'Примерно дете В', group: 'Над 12 години', status: 'active'}
];
let records = examples();
const container = document.querySelector('#demo-records');
const filter = document.querySelector('#status-filter');
const feedback = document.querySelector('#registry-feedback');
function render() {
  container.replaceChildren();
  const visible = records.filter(record => filter.value === 'all' || record.status === filter.value);
  document.querySelector('#registry-count').textContent = `Показани: ${visible.length} от ${records.length} примерни записа`;
  for (const record of visible) {
    const card = document.createElement('article');
    card.className = 'demo-record';
    const name = document.createElement('h2');
    name.textContent = record.child;
    const description = document.createElement('p');
    description.textContent = `${record.id} · ${record.group} · ${record.status === 'new' ? 'Нова заявка' : 'Записан ученик'}`;
    card.append(name, description);
    if (record.status === 'new') {
      const accept = document.createElement('button');
      accept.className = 'secondary-button';
      accept.textContent = 'Потвърди записване';
      accept.addEventListener('click', () => {
        record.status = 'active'; render(); feedback.textContent = 'Примерната заявка е потвърдена.';
      });
      card.append(accept);
    }
    const remove = document.createElement('button');
    remove.className = 'secondary-button';
    remove.textContent = 'Изтрий';
    remove.setAttribute('aria-label', `Изтрий ${record.child}`);
    remove.addEventListener('click', () => {
      records = records.filter(item => item.id !== record.id);
      render(); feedback.textContent = 'Примерният запис е изтрит от демонстрацията.';
    });
    card.append(remove); container.append(card);
  }
}
filter.addEventListener('change', render);
document.querySelector('#reset-demo').addEventListener('click', () => {
  records = examples(); filter.value = 'all'; render(); feedback.textContent = 'Примерните записи са възстановени.';
});
render();
