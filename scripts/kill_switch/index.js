const {GoogleAuth} = require('google-auth-library');

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const PROJECT_NAME = `projects/${PROJECT_ID}`;
const billing = 'https://cloudbilling.googleapis.com/v1/';

exports.stopBilling = async (pubsubEvent, context) => {
  const pubsubData = JSON.parse(
    Buffer.from(pubsubEvent.data, 'base64').toString()
  );
  if (pubsubData.costAmount <= pubsubData.budgetAmount) {
    console.log(`No action necessary. (Current cost: ${pubsubData.costAmount})`);
    return `No action necessary. (Current cost: ${pubsubData.costAmount})`;
  }

  if (!PROJECT_ID) {
    throw new Error('GOOGLE_CLOUD_PROJECT environment variable not set.');
  }

  console.log(`Budget exceeded! (Cost: ${pubsubData.costAmount} / Budget: ${pubsubData.budgetAmount}). Disabling billing for project: ${PROJECT_ID}`);
  await _setAuthCredential();
  const billingEnabled = await _isBillingEnabled(PROJECT_NAME);
  if (billingEnabled) {
    return _disableBillingForProject(PROJECT_NAME);
  } else {
    return 'Billing already disabled';
  }
};

let authClient;
const _setAuthCredential = async () => {
  if (authClient) return;
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-billing', 'https://www.googleapis.com/auth/cloud-platform'],
  });
  authClient = await auth.getClient();
};

const _isBillingEnabled = async (projectName) => {
  const res = await authClient.request({
    url: `${billing}${projectName}/billingInfo`,
  });
  return res.data.billingEnabled;
};

const _disableBillingForProject = async (projectName) => {
  const res = await authClient.request({
    url: `${billing}${projectName}/billingInfo`,
    method: 'PUT',
    data: {billingAccountName: ''},
  });
  console.log('Billing disabled successfully');
  return `Billing disabled: ${JSON.stringify(res.data)}`;
};
