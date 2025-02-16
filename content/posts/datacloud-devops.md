---
title: "DevOps and CI/CD for Salesforce Data Cloud"
date: 2024-02-15
---

# DevOps and CI/CD for Salesforce Data Cloud

Managing changes and deployments for Data Cloud adds a new dimension to Salesforce DevOps. Unlike standard Salesforce metadata (custom objects, apex, etc.), Data Cloud has its own set of components (data streams, mappings, identity rules, etc.) that need to be promoted across environments. In this post, we’ll outline how to implement CI/CD for Data Cloud – covering packaging, deployment, version control of Data Cloud metadata, and automation tips.

## Packaging Data Cloud Metadata with Data Kits

Salesforce has introduced the concept of **Data Kits** specifically for packaging Data Cloud metadata. A **Data Kit** is essentially a container that holds all your Data Cloud config components so they can be deployed or packaged together ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=,via%20SFDX%20or%20Metadata%20API)).

- Think of a Data Kit like a mini package *inside* a Salesforce package, dedicated to Data Cloud stuff. Why is this needed? Because Data Cloud features actually run on a different infrastructure (different “domain”) than core Salesforce, they cannot be directly deployed via normal Metadata API alone ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=,via%20SFDX%20or%20Metadata%20API)). The Data Kit wraps them so you can move them, and then a special process “unwraps” them in the target org.

**What can go in a Data Kit?** Data streams, data model object definitions, identity resolution configs, calculated insights, segments, etc. – basically most config you do in Data Cloud can be added to a Data Kit. (Not absolutely everything is supported yet, but Salesforce is expanding coverage. You can check the **Data Cloud Extensibility Readiness Matrix** to see which components are packageable ([Packages and Data Kits | Get Started with Data Cloud Development | Data Cloud Developer Guide | Salesforce Developers](https://developer.salesforce.com/docs/data/data-cloud-dev/guide/packages-data-kits.html#:~:text=customers)).)

**DevOps flow with Data Kits:**
1. In your source org (say a Dev or UAT environment), you create a Data Kit and add components to it via the UI or APIs. For example, you create a Data Kit called “Customer360Config”. Into that Data Kit, you add “Individual Data Stream from CRM”, “Identity Resolution Ruleset 1”, “High Value Segment”, etc. Now this Data Kit contains all those pieces.
2. You then retrieve this Data Kit via Metadata API or create a **package version** if using unlocked packaging. Starting Winter ’25, Salesforce requires packaging Data Cloud stuff separately (you can’t mix Data Cloud metadata with other metadata in one package) ([Packages and Data Kits | Get Started with Data Cloud Development | Data Cloud Developer Guide | Salesforce Developers](https://developer.salesforce.com/docs/data/data-cloud-dev/guide/packages-data-kits.html#:~:text=If%20you%E2%80%99re%20packaging%20both%20Data,a%20single%20package%20isn%E2%80%99t%20allowed)). So you might have one unlocked package just for Data Cloud, containing the Data Kit.
3. Deploy to target org: If using packaging, you install the package in the target environment (e.g., prod or staging). If using metadata API directly (like with SFDX deploy), you deploy the Data Kit metadata.
4. **Activate (Unwrap) Data Kit in target**: This is a crucial step. After deployment, the Data Cloud components are in the org but not active until you run the DataKit deployment. Salesforce provides an invocable action (often referred to as the “DataKit Connect API”) which actually tells Data Cloud to take those deployed config and create them in the Data Cloud system ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=,corresponding%20Data%20Cloud%20server%20domain)) ([migration - How data cloud metadata components can be deployed or migrated from one source org to the target org? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429221/how-data-cloud-metadata-components-can-be-deployed-or-migrated-from-one-source-o#:~:text=So%20Data%20Kit%20container%20can,package%20installation%20or%20SFDX%20deployment)). Essentially, it unwraps the Data Kit container.
   - This can be done via a REST call to a custom action endpoint as documented ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=Flow%20name%20is%20,where%20Data%20Cloud%20is%20enabled)), or possibly via a UI action (in Setup, maybe a button like “Deploy Data Kit components”). The invocable action is named `sfdatakit__DeployDataKitComponents` ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=deployment%20of%20Data%20Kit%20components,corresponding%20Data%20Cloud%20server%20domain)).
   - Tools like Gearset or Copado may handle this for you under the hood by automatically calling the flow after deployment ([Copado Support for Salesforce Data Cloud](https://docs.copado.com/articles/copado-ci-cd-publication/copado-support-for-salesforce-data-cloud#:~:text=Copado%20Support%20for%20Salesforce%20Data,Data%20Kit)).

So, to automate CI/CD:
- **Use SFDX or Packages**: You can retrieve the Data Kit as metadata (it will appear as something like an `<DataKit>` metadata type in the package.xml). Check Salesforce’s Metadata API docs for “Data Cloud Metadata Types” – you’ll see types for data streams, etc., but you really only need to retrieve the DataKit container, which should bring along its contents.
- Check your source control after retrieval: the Data Cloud components will be represented in XML. For example, a Data Stream might show up as an XML file under the DataStream metadata folder. Ensure these are tracked in version control alongside your other metadata.
- **Deployment script**: Your CI script (Jenkins, GitHub Actions, etc.) should deploy the Data Cloud metadata to the target environment. If using unlocked packages, you’d create a package version and install it.
- **Post-deployment step**: After deployment, execute the Data Kit deployment flow. This could be done by:
  - Running a simple Apex script (which you include in the deployment or run via anonymous Apex) that calls the invocable action. For example:
    ```java
    // pseudo-code: run after metadata deploy
    ConnectApi.DataKitDeployment.deployDataKit('Customer360Config');
    ```
    (Salesforce may have a method, or you call the REST as described.)
  - Or use Salesforce CLI to call the custom REST endpoint. You can use `sfdx force:data:rest:POST -u targetOrg -p /services/data/v61.0/actions/custom/flow/sfdatakit__DeployDataKitComponents -b @body.json` where `body.json` contains the inputs (essentially the DataKit name or components list) ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=Flow%20name%20is%20,where%20Data%20Cloud%20is%20enabled)).
- This extra step ensures the Data Cloud platform in that org picks up the changes. If you skip it, the metadata might be present but not applied (e.g., the new data stream won’t show up in UI until deployed fully).

Salesforce partner ISVs can even distribute Data Cloud config as part of a managed package using Data Kits ([Packages and Data Kits | Get Started with Data Cloud Development | Data Cloud Developer Guide | Salesforce Developers](https://developer.salesforce.com/docs/data/data-cloud-dev/guide/packages-data-kits.html#:~:text=Customer%20developers%2C%20that%20is%2C%20developers,org%20to%20a%20production%20org)) ([Packages and Data Kits | Get Started with Data Cloud Development | Data Cloud Developer Guide | Salesforce Developers](https://developer.salesforce.com/docs/data/data-cloud-dev/guide/packages-data-kits.html#:~:text=Salesforce%20partners%20who%20build%20apps,apps%20for%20Data%20Cloud%20customers)). For internal projects, you’ll typically use an unlocked package or change set equivalent (if manual).

**Best Practices for Data Cloud Deployment:**
- **Keep Data Cloud metadata in a separate package**: As mentioned, don’t mix with your main app package. Changesets can deploy Data Cloud stuff, but it’s better to script it for repeatability.
- **Use Source Control**: Treat Data Cloud config as code. When a team member changes a mapping or adds a segment in a dev org, retrieve and commit those changes. This prevents “it works in dev, but we forgot to replicate that click in prod” scenarios. The Data Kit helps encapsulate this.
- **Be mindful of environment-specific details**: Some Data Cloud settings might be org-specific and not easily moved, e.g., data source credentials (like an AWS key for an S3 data stream) likely do **not** get moved with metadata for security. You might need to reconfigure such connections in each environment. Plan for a deployment runbook step to e.g. enter the credentials for connectors (these are often kept out of metadata on purpose).
- **Testing after deploy**: After deploying Data Cloud components to a new env, do a quick smoke test. E.g., check that the data streams are listed and perhaps run one to ensure it works (likely with test data). Also run the identity resolution once to ensure it’s functional. This ensures that the config moved correctly and is not missing something.

## Versioning and Environment Strategy

Data Cloud development might involve multiple environments (Dev, QA, UAT, Prod). How do you manage changes? A few tips:
- **Use a Source Dev Org**: Perhaps designate a specific dev or sandbox where all Data Cloud config changes are made (or use scratch orgs if possible, though as of now Data Cloud in scratch orgs is not widely available). Then treat that as the source of truth for metadata (pull from it into source control).
- **Document Data Cloud Dependencies**: For example, if a data stream expects an external system or file, ensure that exists in each env. E.g., in UAT env, you might need a different S3 bucket URL than in Prod. Those differences might not be captured in metadata and need manual update after deploy.
- **Data Kits as Templates**: Interestingly, Data Kits can be used as *templates*. You could have a Data Kit that packages a set of objects and rules which you install in multiple orgs. If your orgs have similar structure, it will create them. If not, you might need to adjust (especially identity rules might depend on actual data present).
- **Rollback Strategy**: Rolling back a Data Cloud deployment isn’t straightforward (since once you deploy and “unwrap,” reversing it might require deleting components manually or deploying a previous version’s Data Kit). The best approach is treat deployments carefully – test in a staging environment first. If something goes wrong in production, you might deploy a Data Kit that represents the previous known-good state.

## Automating Data Cloud in CI

Your continuous integration pipeline can include Data Cloud steps. For example:
1. **Validate Metadata**: Run `sfdx force:source:convert` and `force:mdapi:deploy --checkonly` on your Data Cloud metadata (Data Kit) to ensure it’s deployable (like a compile check).
2. **Unit Tests**: If you have Apex that interacts with Data Cloud, you should have unit tests. Salesforce might allow tests to query Data Cloud objects in a limited way, or you might need to use mocks. If static SOQL is used for DMOs, you might be able to mock those like regular SOQL using the new testing features (Summer '24 introduced the ability to mock Data Cloud SOQL responses in tests ([Top 5 Salesforce Apex Features of Summer'24 - SalesforceCodex](https://salesforcecodex.com/salesforce/top-5-salesforce-apex-features-of-summer24/#:~:text=SalesforceCodex%20salesforcecodex,Cloud%20data%20model%20objects))).
3. **Deploy**: Deploy the Data Cloud metadata to a test org as part of CI and run any relevant tests.
4. **Automated Data Load for Testing**: Optionally, you could automate loading some sample data into Data Cloud in a test scratch org to verify that after deployment the identity resolution and segments work. This would be an integration test level. For instance, have a script call the Ingestion API to load 10 records, then call the identity resolution API, and verify via query that unified profiles count == expected. This is advanced, but ensures your config actually does what it should. (This requires the scratch org or test org to be able to ingest – might not be trivial to automate given Data Cloud complexities, so consider cost vs. benefit here.)

## Example Deployment Scenario

Imagine you’ve configured in UAT a new data stream for a Loyalty system, plus a segment “Loyalty High Spenders.” You want to deploy to Prod.

- You add the new data stream, mapping, and segment to your existing Data Kit in UAT (or create a new Data Kit if starting fresh).
- Use SFDX to retrieve the DataKit: `sfdx force:source:retrieve -m DataCloudDataKit:Customer360Config -u UAT` (the metadata name might differ). This pulls down something like:
  - `dataCloud/DataKit/Customer360Config.dataKit-meta.xml`
  - Inside likely references to the data stream, etc., which might also appear as separate files.
- Commit those changes to Git (code review, etc.).
- In CI, run `sfdx force:source:convert` and then deploy to Prod: `sfdx force:mdapi:deploy -d mdapi_output -u Prod -w 30`.
- After deployment, run an Apex script or API call to execute the Data Kit deployment flow:
  ```bash
  sfdx force:data:rest:POST -u Prod -e /actions/custom/flow/sfdatakit__DeployDataKitComponents -f deployBody.json
  ```
  Where `deployBody.json` might look like:
  ```json
  {
    "inputs": [{
      "dataKitName": "Customer360Config"
    }]
  }
  ```
  (The exact JSON structure may vary; check Salesforce docs. The StackExchange example showed a more granular component list ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=Flow%20name%20is%20,where%20Data%20Cloud%20is%20enabled)), but hopefully just name works if deploying whole kit.)
- CI checks the response for success. If success, the Data Cloud components are now live in Prod.

- After that, maybe have a manual or automated step to update any secure info: e.g., edit the new Data Stream in Prod to enter credentials if those didn’t carry over (like OAuth client secrets for an API source).

- Finally, do a quick data test: ingest a test record to ensure it flows, or verify the segment appears in Prod.

## Collaboration and Multi-Developer Work

If multiple team members work on Data Cloud config, consider these:
- **Branching Strategy**: If one dev is adding a new Calculated Insight and another is modifying identity resolution, you might want to use feature branches in Git and a mechanism to merge changes. Because Data Cloud config can be complex, coordinate to avoid conflicts (e.g., two people editing the same Data Kit components).
- **Data Kit modularization**: You could create multiple Data Kits if that helps segmentation of work (e.g., one Data Kit for “Profile config”, another for “Engagement data config”). But note that you cannot currently deploy multiple data kits in one package with non-Data Cloud metadata in Winter '25 and beyond ([Packages and Data Kits | Get Started with Data Cloud Development | Data Cloud Developer Guide | Salesforce Developers](https://developer.salesforce.com/docs/data/data-cloud-dev/guide/packages-data-kits.html#:~:text=If%20you%E2%80%99re%20packaging%20both%20Data,a%20single%20package%20isn%E2%80%99t%20allowed)). So maybe stick to one Data Kit unless a strong reason.
- **Environments Sync**: Keep lower environments in sync with Prod for Data Cloud. If someone changed a mapping directly in Prod (not ideal, but if it happens in an urgent fix), make sure to bring that back to source control and other envs. Ideally, all changes go through pipeline.

**DevOps Key Points:**
- **Use Data Kits** to bundle Data Cloud config for deployment ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=,via%20SFDX%20or%20Metadata%20API)). This is the official path to move Data Cloud components between orgs.
- Integrate Data Cloud metadata into your **source control and CI process** like you do for custom objects or code. Retrieve and commit XML definitions of Data Cloud components whenever they change, to avoid manual reproductions.
- **Automate deployment** including the crucial step of running the DataKit deployment flow in the target org ([rest api - What is DataKit? What is DataKit Connect API? - Salesforce Stack Exchange](https://salesforce.stackexchange.com/questions/429218/what-is-datakit-what-is-datakit-connect-api#:~:text=,corresponding%20Data%20Cloud%20server%20domain)). Without this, your components might not be active. Use SFDX or Apex to invoke it post-deployment.
- Be aware of what **doesn’t deploy**. For example, connector credentials or certain tenant-specific settings won’t be in metadata – document these and include manual steps or separate automation (maybe a script to set them via API if supported, or instructions for admins).
- **Test deployments in a lower environment first**. Data Cloud is relatively new, so double-checking that everything comes over correctly is worth the time. For instance, ensure segments criteria are intact, identity rules are enabled, etc., after a deploy in staging before hitting Prod.
- **Continuous integration**: where possible, include Data Cloud in CI tests (even if just deploying to a scratch org and running a simple query test). This will catch issues early, like missing components or misnamed references in the metadata.
- With a solid CI/CD in place, you can confidently promote Data Cloud changes. This means faster iteration: e.g., an improvement to identity resolution logic can move to production with the same rigor and safety as a change to an Apex class.

Next, we’ll explore examples of data flows and ETL scenarios with Data Cloud – basically how to implement common data transformation pipelines using the platform.