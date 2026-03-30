export default [
  // --- Atlassian ---
  {
    id: 'atlassian',
    name: 'Atlassian',
    url: 'https://status.atlassian.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- GitHub ---
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://www.githubstatus.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- GitLab ---
  {
    id: 'gitlab',
    name: 'GitLab',
    url: 'https://status.gitlab.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- Cloudflare ---
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    url: 'https://www.cloudflarestatus.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- Okta (RSS only public) ---
  {
    id: 'okta',
    name: 'Okta',
    url: 'https://feeds.feedburner.com/OktaStatusRSS',
    type: 'rss',
  },

  // --- Zoom ---
  {
    id: 'zoom',
    name: 'Zoom',
    url: 'https://status.zoom.us/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- Zendesk ---
  {
    id: 'zendesk',
    name: 'Zendesk',
    url: 'https://status.zendesk.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- PagerDuty ---
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    url: 'https://status.pagerduty.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- Datadog ---
  {
    id: 'datadog',
    name: 'Datadog',
    url: 'https://status.datadoghq.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- New Relic ---
  {
    id: 'newrelic',
    name: 'New Relic',
    url: 'https://status.newrelic.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- AWS (RSS public) ---
  {
    id: 'aws',
    name: 'AWS',
    url: 'https://status.aws.amazon.com/rss/all.rss',
    type: 'rss',
  },

  // --- Microsoft 365 (public HTML dashboard) ---
  {
    id: 'm365',
    name: 'Microsoft 365',
    url: 'https://status.office.com/',
    type: 'html',
  },

  // --- ServiceNow ---
  {
    id: 'servicenow',
    name: 'ServiceNow',
    url: 'https://status.servicenow.com/api/v2/summary.json',
    type: 'statuspage',
  },

  // --- Slack ---
  {
    id: 'slack',
    name: 'Slack',
    url: 'https://status.slack.com/',
    type: 'html',
  },
];
