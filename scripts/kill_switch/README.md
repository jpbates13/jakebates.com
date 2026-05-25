# Firebase / GCP Billing Kill Switch

This directory contains the code necessary to automatically shut off all billing for your Firebase project if your budget is ever exceeded.

## How to deploy:

1. **Create a Pub/Sub Topic**
   * Go to the [GCP Pub/Sub Console](https://console.cloud.google.com/cloudpubsub/topic/list).
   * Click **Create Topic**.
   * Name it `budget-alerts` and click Create.

2. **Connect your Budget to the Topic**
   * Go to the [GCP Billing Budgets Console](https://console.cloud.google.com/billing/budgets).
   * Edit your $1 budget.
   * Under "Actions", check the box for **"Connect a Pub/Sub topic to this budget"**.
   * Select the `budget-alerts` topic you just created. Save.

3. **Deploy this Cloud Function**
   * Open your terminal and navigate to this folder:
     ```bash
     cd scripts/kill_switch
     ```
   * Deploy the function using `gcloud` (requires you to have the gcloud CLI installed):
     ```bash
     gcloud functions deploy stopBilling \
       --project jakebates-bb631 \
       --source scripts/kill_switch \
       --no-gen2 \
       --runtime nodejs22 \
       --trigger-topic budget-alerts \
       --region us-central1 \
       --allow-unauthenticated
     ```

4. **Grant Billing Permissions**
   * The Cloud Function runs as the "Default Compute Service Account". 
   * It needs permission to unlink the billing account.
   * Go to the [Billing Account IAM page](https://console.cloud.google.com/billing/iam).
   * Find your project's default compute service account (`<project-number>-compute@developer.gserviceaccount.com`).
   * Grant it the role: **Billing Account Administrator**.

That's it! If your $1 budget is reached, GCP will publish a message to `budget-alerts`, triggering `stopBilling`, which physically unlinks your credit card. Firebase will immediately throw `resource-exhausted` errors, and your React app will automatically display the "Jake is Broke" page!
