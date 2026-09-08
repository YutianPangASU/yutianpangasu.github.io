---
layout: archive
title: "Sitemap"
title_zh: "站点地图"
permalink: /sitemap/
author_profile: true
---

{% include base_path %}

<div class="i18n-en" markdown="1">
A list of all the posts and pages found on the site. For you robots out there, there is an [XML version]({{ base_path }}/sitemap.xml) available for digesting as well.
</div>

<div class="i18n-zh" lang="zh-Hans" markdown="1">
本站全部文章与页面的列表。对于爬虫程序，这里还有一份可供解析的 [XML 版本]({{ base_path }}/sitemap.xml)。
</div>

<h2>{% include t.html en="Pages" zh="页面" %}</h2>
{% for post in site.pages %}
  {% include archive-single.html %}
{% endfor %}

<h2>{% include t.html en="Posts" zh="文章" %}</h2>
{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}

{% capture written_label %}'None'{% endcapture %}

{% for collection in site.collections %}
{% unless collection.output == false or collection.label == "posts" %}
  {% capture label %}{{ collection.label }}{% endcapture %}
  {% if label != written_label %}
  <h2>{{ label }}</h2>
  {% capture written_label %}{{ label }}{% endcapture %}
  {% endif %}
{% endunless %}
{% for post in collection.docs %}
  {% unless collection.output == false or collection.label == "posts" %}
  {% include archive-single.html %}
  {% endunless %}
{% endfor %}
{% endfor %}
