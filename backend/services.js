const monitoredServices = [
  {
    id: "atlassian",
    name: "Atlassian",
    url: "https://status.atlassian.com/api/v2/summary.json",
    resolver: "statuspage",
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://www.githubstatus.com/api/v2/summary.json",
    resolver: "statuspage",
  },
  {
    id: "gitlab",
    name: "GitLab",
    url: "https://status.gitlab.com/pages/5b36dc6502d06804c08349f7/rss",
    resolver: "rss",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    url: "https://www.cloudflarestatus.com/api/v2/summary.json",
    resolver: "statuspage",
  },
  {
    id: "okta",
    name: "Okta",
    url: "https://feeds.feedburner.com/OktaStatusRSS",
    resolver: "rss",
  },
  {
    id: "zoom",
    name: "Zoom",
    url: "https://status.zoom.us/api/v2/summary.json",
    resolver: "statuspage",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    url: "https://status.zendesk.com/",
    resolver: "html",
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    url: "https://status.pagerduty.com/incidents/dashboard",
    resolver: "html",
  },
  {
    id: "datadog",
    name: "Datadog US1",
    url: "https://status.datadoghq.com/api/v2/summary.json",
    resolver: "statuspage",
  },
  {
    id: "newrelic",
    name: "New Relic",
    url: "https://status.newrelic.com/api/v2/summary.json",
    resolver: "statuspage",
  },
  {
    id: "aws",
    name: "AWS",
    url: "https://status.aws.amazon.com/rss/all.rss",
    resolver: "rss",
  },
  {
    id: "m365",
    name: "Microsoft 365",
    url: "https://status.office.com/",
    resolver: "html",
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    url: "https://servicenow.statuspage.io/api/v2/summary.json",
    resolver: "statuspage",
  },
  {
    id: "slack",
    name: "Slack",
    url: "https://status.slack.com/",
    resolver: "html",
  },
  {
    id: "claude",
    name: "Claude",
    url: "https://status.claude.com/api/v2/status.json",
    sourceType: "statuspage",
  },
];

export default monitoredServices;
