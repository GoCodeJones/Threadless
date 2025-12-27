const express = require('express');
const router = express.Router();
const connectionsService = require('../services/connections');

router.use(express.json());

// listar conexões
router.get('/connections', (req, res) => {
  const connections = connectionsService.getAllConnections();
  res.json(connections);
});

// adicionar conexão manualmente
router.post('/connections', (req, res) => {
  const { id, name, site, feed } = req.body;

  if (!id || !name || !site || !feed) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  connectionsService.addConnection({ id, name, site, feed });
  res.status(201).json({ success: true });
});

module.exports = router;
