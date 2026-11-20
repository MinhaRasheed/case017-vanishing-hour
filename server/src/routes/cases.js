const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const casesDir = path.resolve(__dirname, '../../client/src/data/cases');

// List available cases
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(casesDir)) {
      return res.json({ success: true, cases: [] });
    }
    const caseDirs = fs.readdirSync(casesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const cases = [];
    for (const dir of caseDirs) {
      const caseJsonPath = path.join(casesDir, dir, 'case.json');
      if (fs.existsSync(caseJsonPath)) {
        const data = JSON.parse(fs.readFileSync(caseJsonPath, 'utf8'));
        cases.push({
          id: data.id || dir,
          title: data.title,
          subtitle: data.subtitle,
          difficulty: data.difficulty,
          estimatedTime: data.estimatedTime,
          summary: data.summary,
          status: data.status || 'Active'
        });
      }
    }

    return res.json({ success: true, cases });
  } catch (err) {
    console.error('Error listing cases:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get complete case data
router.get('/:caseId', (req, res) => {
  try {
    const casePath = path.join(casesDir, req.params.caseId);
    if (!fs.existsSync(casePath)) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const files = ['case', 'suspects', 'locations', 'evidence', 'dialogue', 'timeline'];
    const caseBundle = {};

    for (const file of files) {
      const filePath = path.join(casePath, `${file}.json`);
      if (fs.existsSync(filePath)) {
        caseBundle[file] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    }

    return res.json({ success: true, caseData: caseBundle });
  } catch (err) {
    console.error('Error loading case bundle:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
