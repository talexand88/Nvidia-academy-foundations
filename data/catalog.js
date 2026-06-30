window.NVDAM_CATALOG = {
  version: "0.1",
  storage: {
    mode: "self-hosted-filesystem",
    localRoot: "storage",
    productionEnv: "ACADEMY_STORAGE_ROOT",
    database: "sqlite"
  },
  pages: [
    { id: "home", title: "NVIDIA Academy Visual Foundations", href: "index.html", type: "home", status: "published", tags: ["home", "portal"] },
    { id: "content", title: "Content", href: "content.html", type: "hub", status: "published", tags: ["guides", "reference"] },
    { id: "assets", title: "Assets", href: "assets.html", type: "hub", status: "published", tags: ["assets", "downloads"] },
    { id: "toolkit", title: "Toolkit", href: "toolkit.html", type: "hub", status: "published", tags: ["tools"] },
    { id: "case-studies", title: "Case studies", href: "case-studies.html", type: "hub", status: "published", tags: ["examples"] },
    { id: "reviews", title: "Reviews", href: "reviews.html", type: "tool", status: "published", tags: ["review", "comments", "report"] },
    { id: "typography", title: "Typography", href: "typography.html", type: "guide", status: "published", tags: ["type", "tokens"] },
    { id: "color", title: "Color", href: "color.html", type: "guide", status: "published", tags: ["color", "tokens"] },
    { id: "frames-cards", title: "Frames and cards", href: "frames-cards.html", type: "guide", status: "published", tags: ["cards", "layout"] },
    { id: "spacing", title: "Spacing", href: "spacing.html", type: "guide", status: "published", tags: ["layout", "spacing"] },
    { id: "logos-hero", title: "Logos", href: "logos-hero.html", type: "guide", status: "published", tags: ["logos", "brand"] },
    { id: "imagery", title: "Imagery", href: "imagery.html", type: "guide", status: "published", tags: ["images", "visuals"] },
    { id: "code-cli", title: "Code and CLI", href: "code-cli.html", type: "guide", status: "published", tags: ["code", "terminal"] },
    { id: "charts", title: "Charts", href: "charts.html", type: "guide", status: "published", tags: ["charts", "data"] },
    { id: "patterns", title: "Patterns", href: "patterns.html", type: "hub", status: "published", tags: ["patterns"] },
    { id: "topologies", title: "Topologies", href: "topologies.html", type: "guide", status: "draft", tags: ["network", "diagrams"] },
    { id: "icons", title: "Icon library", href: "icons.html", type: "asset_page", status: "published", tags: ["icons", "downloads"] },
    { id: "logos", title: "Logo downloads", href: "logos.html", type: "asset_page", status: "published", tags: ["logos", "downloads"] },
    { id: "templates", title: "Templates", href: "templates.html", type: "asset_page", status: "published", tags: ["templates", "downloads"] },
    { id: "pattern-tree", title: "Pattern picker", href: "pattern-tree.html", type: "tool", status: "published", tags: ["tool", "patterns"] },
    { id: "screenshot-review", title: "Screenshot review", href: "screenshot-review.html", type: "tool", status: "draft", tags: ["tool", "review"] },
    { id: "pptx-validator", title: "PowerPoint validator", href: "pptx-validator.html", type: "tool", status: "draft", tags: ["tool", "powerpoint"] },
    { id: "motion", title: "Motion", href: "motion.html", type: "placeholder", status: "draft", tags: ["motion", "v2"] }
  ],
  assetCollections: [
    {
      id: "icons-library",
      title: "NVIDIA icon library",
      type: "icon_library",
      status: "published",
      href: "icons.html",
      summary: "Searchable library of NVIDIA marketing icons.",
      countLabel: "672 icons",
      tags: ["icons", "svg", "nvidia"]
    },
    {
      id: "logos",
      title: "Logo downloads",
      type: "logo",
      status: "published",
      href: "logos.html",
      summary: "Approved NVIDIA wordmark variants for screen use.",
      countLabel: "6 files",
      tags: ["logos", "brand", "png"]
    },
    {
      id: "powerpoint-masters",
      title: "PowerPoint masters",
      type: "template",
      status: "published",
      href: "templates.html#powerpoint",
      summary: "Light and dark NVIDIA Academy PowerPoint masters.",
      countLabel: "2 files",
      tags: ["powerpoint", "template", "pptx"]
    },
    {
      id: "topology-samples",
      title: "Topology sample library",
      type: "deck",
      status: "published",
      href: "templates.html#topologies",
      summary: "Canonical topology icon set and ready-to-copy diagrams.",
      countLabel: "1 file",
      tags: ["topology", "network", "pptx"]
    },
    {
      id: "after-effects-template",
      title: "After Effects template",
      type: "template",
      status: "coming_soon",
      href: "templates.html#after-effects",
      summary: "Motion template for title openers, section bridges, and end cards.",
      countLabel: "coming soon",
      tags: ["after effects", "motion", "template"]
    },
    {
      id: "fonts",
      title: "Fonts",
      type: "font",
      status: "coming_soon",
      href: "",
      summary: "NVIDIA Sans and Consolas font installation package.",
      countLabel: "coming soon",
      tags: ["fonts", "typography"]
    },
    {
      id: "powerpoint-icon-plugin",
      title: "NVIDIA icon library plugin",
      type: "plugin",
      status: "published",
      href: "https://talexand88.github.io/nvidia-icon-addin",
      summary: "PowerPoint task-pane add-in for inserting NVIDIA icons directly into slides.",
      countLabel: "external app",
      tags: ["plugin", "powerpoint", "icons"]
    }
  ],
  files: [
    {
      id: "logo-horizontal-white",
      assetId: "logos",
      displayName: "Horizontal logo, white",
      version: "v1",
      path: "downloads/logos/nvidia-logo-horiz-rgb-wht-for-screen.png",
      type: "image/png",
      status: "published"
    },
    {
      id: "logo-horizontal-black",
      assetId: "logos",
      displayName: "Horizontal logo, black",
      version: "v1",
      path: "downloads/logos/nvidia-logo-horiz-rgb-blk-for-screen.png",
      type: "image/png",
      status: "published"
    },
    {
      id: "logo-horizontal-one-color-white",
      assetId: "logos",
      displayName: "Horizontal logo, one-color white",
      version: "v1",
      path: "downloads/logos/nvidia-logo-horiz-rgb-1c-wht-for-screen.png",
      type: "image/png",
      status: "published"
    },
    {
      id: "logo-vertical-black",
      assetId: "logos",
      displayName: "Vertical logo, black",
      version: "v1",
      path: "downloads/logos/nvidia-logo-vert-rgb-blk-for-screen.png",
      type: "image/png",
      status: "published"
    },
    {
      id: "logo-vertical-one-color-white",
      assetId: "logos",
      displayName: "Vertical logo, one-color white",
      version: "v1",
      path: "downloads/logos/nvidia-logo-vert-rgb-1c-wht-for-screen.png",
      type: "image/png",
      status: "published"
    },
    {
      id: "logo-vertical-white",
      assetId: "logos",
      displayName: "Vertical logo, white",
      version: "v1",
      path: "downloads/logos/nvidia-logo-vert-rgb-wht-for-screen.png",
      type: "image/png",
      status: "published"
    },
    {
      id: "powerpoint-master-dark",
      assetId: "powerpoint-masters",
      displayName: "PowerPoint master, dark",
      version: "v1",
      path: "downloads/templates/nvidia-academy-master_Dark.pptx",
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      status: "published"
    },
    {
      id: "powerpoint-master-light",
      assetId: "powerpoint-masters",
      displayName: "PowerPoint master, light",
      version: "v1",
      path: "downloads/templates/nvidia-academy-master_Light.pptx",
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      status: "published"
    },
    {
      id: "topology-samples-pptx",
      assetId: "topology-samples",
      displayName: "Topology samples",
      version: "v1",
      path: "downloads/templates/topology-samples.pptx",
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      status: "published"
    }
  ],
  review: {
    targetAttribute: "data-review-id",
    statuses: ["open", "resolved", "archived"],
    priorities: ["low", "normal", "high"]
  }
};
