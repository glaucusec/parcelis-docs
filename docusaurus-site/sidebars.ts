import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import apiSidebar from './docs/api/sidebar';

const sidebars: SidebarsConfig = {
  "docsSidebar": [
    {
      "type": "category",
      "label": "Platform User Guide",
      "link": {
        "type": "generated-index"
      },
      "items": [
        "Platform User Guide/platform-user-guide",
        {
          "type": "category",
          "label": "Getting Started",
          "link": {
            "type": "doc",
            "id": "Platform User Guide/getting-started/index"
          },
          "items": [
            "Platform User Guide/getting-started/first-steps",
            "Platform User Guide/getting-started/sign-in",
            "Platform User Guide/getting-started/portfolio-dashboard"
          ]
        },
        {
          "type": "category",
          "label": "Core Concepts",
          "link": {
            "type": "doc",
            "id": "Platform User Guide/core-concepts/index"
          },
          "items": [
            "Platform User Guide/core-concepts/portfolio",
            "Platform User Guide/core-concepts/property",
            "Platform User Guide/core-concepts/unit",
            "Platform User Guide/core-concepts/tenant",
            "Platform User Guide/core-concepts/notes",
            "Platform User Guide/core-concepts/lease",
            "Platform User Guide/core-concepts/maintenance-ticket"
          ]
        },
        {
          "type": "category",
          "label": "App Functionality",
          "link": {
            "type": "doc",
            "id": "Platform User Guide/app-functionality/index"
          },
          "items": [
            "Platform User Guide/app-functionality/detail-page-actions",
            "Platform User Guide/app-functionality/add-a-property",
            "Platform User Guide/app-functionality/property-directory",
            "Platform User Guide/app-functionality/manage-a-property",
            "Platform User Guide/app-functionality/unit-details",
            "Platform User Guide/app-functionality/property-details",
            "Platform User Guide/app-functionality/maintenance",
            "Platform User Guide/app-functionality/lease-dashboard",
            "Platform User Guide/app-functionality/lease-details",
            "Platform User Guide/app-functionality/income-dashboard",
            "Platform User Guide/app-functionality/add-a-tenant",
            "Platform User Guide/app-functionality/tenant-directory",
            "Platform User Guide/app-functionality/manage-a-tenant",
            "Platform User Guide/app-functionality/tenant-details"
          ]
        },
        {
          "type": "category",
          "label": "Navigation And Preferences",
          "link": {
            "type": "doc",
            "id": "Platform User Guide/navigation-and-preferences/index"
          },
          "items": [
            "Platform User Guide/navigation-and-preferences/sidebar",
            "Platform User Guide/navigation-and-preferences/profile",
            "Platform User Guide/navigation-and-preferences/organization-settings",
            "Platform User Guide/navigation-and-preferences/email-settings",
            "Platform User Guide/navigation-and-preferences/users",
            "Platform User Guide/navigation-and-preferences/notifications",
            "Platform User Guide/navigation-and-preferences/collapse-navigation",
            "Platform User Guide/navigation-and-preferences/theme",
            "Platform User Guide/navigation-and-preferences/keyboard-shortcuts"
          ]
        },
        "Platform User Guide/pricing"
      ]
    },
    {
      "type": "category",
      "label": "Deployment",
      "link": {
        "type": "generated-index"
      },
      "items": [
        "Deployment/deploy-with-docker",
        "Deployment/deploy-with-docker-compose",
        "Deployment/deploy-with-docker-compose-single-image",
        "Deployment/upgrade-postgresql",
        "Deployment/email-configuration",
        "Deployment/status-monitor",
        "Deployment/api-token-rollout"
      ]
    },
    {
      "type": "category",
      "label": "For contributors",
      "link": {
        "type": "generated-index"
      },
      "items": [
        "For contributors/contributor-getting-started",
        "For contributors/architecture",
        "For contributors/database-erd",
        "For contributors/lease-rent-schedule",
        "For contributors/end-to-end-testing",
        "For contributors/commit-conventions"
      ]
    },
    {
      "type": "category",
      "label": "API Reference",
      "link": {
        "type": "generated-index"
      },
      "items": [
        "API Reference/api-authentication",
        ...apiSidebar
      ]
    }
  ]
};

export default sidebars;
