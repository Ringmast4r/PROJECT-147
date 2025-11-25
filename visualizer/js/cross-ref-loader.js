// Cross-Reference Data Loader
class CrossRefLoader {
    constructor() {
        this.allReferences = [];
        this.loaded = false;
    }

    async load() {
        try {
            console.log('📥 Loading cross-references file...');

            const response = await fetch('../data/cross-references/cross_references_88books.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            console.log('✅ File loaded, parsing...');

            this.parseData(text);
            this.loaded = true;

            console.log(`✅ Loaded ${this.allReferences.length} cross-references`);
            return this.allReferences;
        } catch (error) {
            console.error('❌ Error loading cross-references:', error);
            throw error;
        }
    }

    parseData(text) {
        const lines = text.split('\n');

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('#')) continue;

            const parts = line.split('\t');
            if (parts.length < 3) continue;

            const fromVerse = parts[0].trim();
            const toVerse = parts[1].trim();
            const votes = parseInt(parts[2]) || 0;

            // Determine book type
            const type = this.getBookType(toVerse);

            this.allReferences.push({
                nt: fromVerse,
                target: toVerse,
                votes: votes,
                type: type,
                ntText: '', // Will be populated later if needed
                targetText: '', // Will be populated later if needed
                desc: this.generateDescription(fromVerse, toVerse, type)
            });
        }
    }

    getBookType(verse) {
        // Ethiopian/Pseudepigrapha books
        if (verse.includes('1En.') || verse.includes('Enoch')) return 'Ethiopian';
        if (verse.includes('Jub.') || verse.includes('Jubilees')) return 'Ethiopian';
        if (verse.includes('Meq')) return 'Ethiopian';
        if (verse.includes('4Macc')) return 'Ethiopian';
        if (verse.includes('3Macc')) return 'Ethiopian';
        if (verse.includes('PsSol') || verse.includes('Psalms of Solomon')) return 'Ethiopian';
        if (verse.includes('4Ezra')) return 'Ethiopian';
        if (verse.includes('4Bar')) return 'Ethiopian';
        if (verse.includes('T12Pat')) return 'Ethiopian';
        if (verse.includes('Odes')) return 'Ethiopian';
        if (verse.includes('Prayer of Manasseh')) return 'Ethiopian';
        if (verse.includes('Psalm 151')) return 'Ethiopian';
        // Testaments of the Twelve Patriarchs - individual books
        if (verse.includes('TLevi')) return 'Ethiopian';
        if (verse.includes('TJud')) return 'Ethiopian';
        if (verse.includes('TBenj')) return 'Ethiopian';
        if (verse.includes('TReub')) return 'Ethiopian';
        if (verse.includes('TGad')) return 'Ethiopian';
        if (verse.includes('TDan')) return 'Ethiopian';
        if (verse.includes('TZeb')) return 'Ethiopian';
        if (verse.includes('TIss')) return 'Ethiopian';
        if (verse.includes('TJos')) return 'Ethiopian';
        if (verse.includes('TNaph')) return 'Ethiopian';
        if (verse.includes('TJob')) return 'Ethiopian';
        if (verse.includes('TAsh')) return 'Ethiopian';
        if (verse.includes('TSim')) return 'Ethiopian';

        // Deuterocanonical
        if (verse.includes('Tob.') || verse.includes('Tobit')) return 'Deuterocanonical';
        if (verse.includes('Jdt.') || verse.includes('Judith')) return 'Deuterocanonical';
        if (verse.includes('Wis.') || verse.includes('Wisdom')) return 'Deuterocanonical';
        if (verse.includes('Sir.') || verse.includes('Sirach')) return 'Deuterocanonical';
        if (verse.includes('Bar.') || verse.includes('Baruch')) return 'Deuterocanonical';
        if (verse.includes('1Macc') || verse.includes('2Macc')) return 'Deuterocanonical';

        // Gnostic/Early Christian
        if (verse.includes('GThom') || verse.includes('Gospel of Thomas')) return 'Gnostic';
        if (verse.includes('GPhil') || verse.includes('Gospel of Philip')) return 'Gnostic';
        if (verse.includes('GMary') || verse.includes('Gospel of Mary')) return 'Gnostic';
        if (verse.includes('GJudas') || verse.includes('Gospel of Judas')) return 'Gnostic';
        if (verse.includes('Did.') || verse.includes('Didache')) return 'Gnostic';
        if (verse.includes('Barn.') || verse.includes('Barnabas')) return 'Gnostic';
        if (verse.includes('Herm.') || verse.includes('Hermas')) return 'Gnostic';
        if (verse.includes('ApocPet')) return 'Gnostic';

        return 'Canonical';
    }

    generateDescription(from, to, type) {
        if (type === 'Ethiopian' || type === 'Deuterocanonical') {
            return `Cross-reference to ${type} book`;
        }
        return 'Cross-reference';
    }

    getStats() {
        const stats = {
            total: this.allReferences.length,
            ethiopian: this.allReferences.filter(r => r.type === 'Ethiopian').length,
            deuterocanonical: this.allReferences.filter(r => r.type === 'Deuterocanonical').length,
            gnostic: this.allReferences.filter(r => r.type === 'Gnostic').length,
            canonical: this.allReferences.filter(r => r.type === 'Canonical').length,
            highConfidence: this.allReferences.filter(r => r.votes >= 100).length
        };
        return stats;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossRefLoader;
}
