const prisma = require('../config/db');

/**
 * GET /api/settings  — Public
 * Returns the current platform-level settings singleton (id=1).
 * If no row exists yet, returns safe defaults.
 */
const getSettings = async (req, res) => {
  try {
    let settings = await prisma.platformSettings.findFirst({ where: { id: 1 } });

    if (!settings) {
      // Return defaults (don't create yet — first PUT creates it)
      settings = {
        payDriverPayment:    true,
        payWorkshopPayment:  false,
        payVisitorPayment:   false,
        payOilChangePayment: false,
        showVisitorServices: true,
        freeTrialEnabled:    false,
        freeTrialDuration:   '1 Month',
      };
    }

    return res.json({
      paymentRequiredFor: {
        driver:    settings.payDriverPayment,
        workshop:  settings.payWorkshopPayment,
        visitor:   settings.payVisitorPayment,
        oilchange: settings.payOilChangePayment,
      },
      showVisitorServices: settings.showVisitorServices,
      freeTrialEnabled:    settings.freeTrialEnabled,
      freeTrialDuration:   settings.freeTrialDuration,
    });
  } catch (error) {
    console.error('getSettings error:', error);
    return res.status(500).json({ error: 'Failed to fetch platform settings.' });
  }
};

/**
 * PUT /api/settings  — Admin only
 * Upserts the singleton platform settings row.
 * Body: { paymentRequiredFor: { driver, workshop, visitor, oilchange },
 *         showVisitorServices, freeTrialEnabled, freeTrialDuration }
 */
const updateSettings = async (req, res) => {
  try {
    const {
      paymentRequiredFor = {},
      showVisitorServices,
      freeTrialEnabled,
      freeTrialDuration,
    } = req.body;

    const data = {
      payDriverPayment:    paymentRequiredFor.driver    !== undefined ? Boolean(paymentRequiredFor.driver)    : true,
      payWorkshopPayment:  paymentRequiredFor.workshop  !== undefined ? Boolean(paymentRequiredFor.workshop)  : false,
      payVisitorPayment:   paymentRequiredFor.visitor   !== undefined ? Boolean(paymentRequiredFor.visitor)   : false,
      payOilChangePayment: paymentRequiredFor.oilchange !== undefined ? Boolean(paymentRequiredFor.oilchange) : false,
      showVisitorServices: showVisitorServices !== undefined ? Boolean(showVisitorServices) : true,
      freeTrialEnabled:    freeTrialEnabled   !== undefined ? Boolean(freeTrialEnabled)    : false,
      freeTrialDuration:   freeTrialDuration  || '1 Month',
    };

    const settings = await prisma.platformSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });

    return res.json({
      message: 'Platform settings updated successfully.',
      paymentRequiredFor: {
        driver:    settings.payDriverPayment,
        workshop:  settings.payWorkshopPayment,
        visitor:   settings.payVisitorPayment,
        oilchange: settings.payOilChangePayment,
      },
      showVisitorServices: settings.showVisitorServices,
      freeTrialEnabled:    settings.freeTrialEnabled,
      freeTrialDuration:   settings.freeTrialDuration,
    });
  } catch (error) {
    console.error('updateSettings error:', error);
    return res.status(500).json({ error: 'Failed to update platform settings.' });
  }
};

module.exports = { getSettings, updateSettings };
