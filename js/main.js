// Header shadow on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }
});

// Animate progress bar
window.addEventListener('load', () => {
    setTimeout(() => {
        const fill = document.querySelector('.progress-fill');
        if (fill) fill.style.width = '96%';
    }, 500);
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-in').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.service-card').forEach(card => {
    const status = card.dataset.status;
    if (status && !card.querySelector('.service-status')) {
        const statusNode = document.createElement('span');
        statusNode.className = 'service-status';
        statusNode.textContent = status;
        card.prepend(statusNode);
    }

    const action = card.dataset.action;
    if (action && !card.querySelector('.service-action')) {
        const actionNode = document.createElement('a');
        actionNode.className = 'service-action';
        actionNode.href = status === 'Доступно' ? '#demo' : '#services';
        actionNode.textContent = action;
        card.append(actionNode);
    }
});

const demoState = {
    tool: 'ai',
};

const demoText = document.getElementById('demoText');
const demoScore = document.getElementById('demoScore');
const demoScoreLabel = document.getElementById('demoScoreLabel');
const demoScoreNote = document.getElementById('demoScoreNote');
const demoWords = document.getElementById('demoWords');
const demoSentences = document.getElementById('demoSentences');
const demoAction = document.getElementById('demoAction');
const demoOutput = document.getElementById('demoOutput');

function getTextStats(text) {
    const words = text.trim().match(/[A-Za-zА-Яа-яЁё0-9-]+/g) || [];
    const sentences = text.split(/[.!?]+/).map(item => item.trim()).filter(Boolean);
    return {
        words: words.length,
        sentences: Math.max(sentences.length, text.trim() ? 1 : 0),
    };
}

function typographText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.:;!?])/g, '$1')
        .replace(/(^|[\s(])"([^"]+)"/g, '$1«$2»')
        .replace(/\s-\s/g, ' — ')
        .replace(/еще/g, 'ещё')
        .replace(/Еще/g, 'Ещё')
        .trim();
}

function updateDemo() {
    if (!demoText || !demoScore) return;

    const text = demoText.value;
    const stats = getTextStats(text);
    demoWords.textContent = stats.words;
    demoSentences.textContent = stats.sentences;

    if (demoState.tool === 'typography') {
        const result = typographText(text);
        const changes = Math.max(0, text.length - result.length + (text.includes(' - ') ? 1 : 0));
        demoScore.textContent = `${Math.min(99, Math.max(12, changes * 12 + 18))}%`;
        demoScore.style.background = 'conic-gradient(var(--emerald) 0 72%, var(--border-light) 72% 100%)';
        demoScore.style.color = 'var(--emerald)';
        demoScoreLabel.textContent = 'Типографика';
        demoScoreNote.textContent = 'Исправлены лишние пробелы, тире, кавычки и базовые русские типографские правила.';
        demoAction.textContent = 'Скопировать';
        demoOutput.textContent = result || 'Вставьте текст, чтобы увидеть типографированную версию.';
        return;
    }

    if (demoState.tool === 'readability') {
        const average = stats.sentences ? Math.round(stats.words / stats.sentences) : 0;
        const score = Math.max(12, Math.min(96, 100 - Math.abs(average - 14) * 4));
        demoScore.textContent = `${score}%`;
        demoScore.style.background = `conic-gradient(var(--teal) 0 ${score}%, var(--border-light) ${score}% 100%)`;
        demoScore.style.color = 'var(--teal)';
        demoScoreLabel.textContent = 'Читаемость';
        demoScoreNote.textContent = `Средняя длина предложения: ${average || 0} слов. Оптимально для веб-текста: 10-16 слов.`;
        demoAction.textContent = average > 18 ? 'Сократить фразы' : 'Публиковать';
        demoOutput.textContent = average > 18
            ? 'Рекомендация: разбейте длинные предложения и вынесите сложные мысли в отдельные абзацы.'
            : 'Текст читается легко. Можно усилить его примерами, списками или конкретными цифрами.';
        return;
    }

    const aiWords = ['нейросетевые', 'модели', 'способны', 'генерировать', 'автоматизации', 'контента'];
    const lowerText = text.toLowerCase();
    const hits = aiWords.filter(word => lowerText.includes(word)).length;
    const score = Math.min(88, Math.max(16, hits * 12 + Math.round(stats.words / 8)));
    demoScore.textContent = `${score}%`;
    demoScore.style.background = `conic-gradient(var(--primary) 0 ${score}%, var(--border-light) ${score}% 100%)`;
    demoScore.style.color = 'var(--primary)';
    demoScoreLabel.textContent = 'ИИ-риск';
    demoScoreNote.textContent = score > 55
        ? 'Текст содержит обобщённые формулировки и ровный синтаксис, похожий на машинную генерацию.'
        : 'Текст выглядит достаточно естественным, но результат лучше подтвердить фактами и источниками.';
    demoAction.textContent = score > 55 ? 'Очеловечить' : 'Проверить факты';
    demoOutput.textContent = score > 55
        ? 'Рекомендация: добавьте авторскую позицию, конкретные примеры, источники и менее симметричные формулировки.'
        : 'Рекомендация: сохраните стиль, добавьте источники и проверьте спорные утверждения перед публикацией.';
}

document.querySelectorAll('.demo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.demo-tab').forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        demoState.tool = tab.dataset.tool;
        updateDemo();
    });
});

document.querySelector('.demo-run')?.addEventListener('click', updateDemo);
demoText?.addEventListener('input', updateDemo);

document.querySelector('.demo-copy-btn')?.addEventListener('click', async () => {
    if (!demoOutput) return;
    try {
        await navigator.clipboard.writeText(demoOutput.textContent);
    } catch (error) {
        // Clipboard access can be unavailable from local files.
    }
});

updateDemo();
