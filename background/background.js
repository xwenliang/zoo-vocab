//background虽然天然可以跨域，然而既然是后台就没有cookie的概念，即使fetch设置了credentials，cookie依然不会被保存
//http://stackoverflow.com/questions/29251842/why-new-js-fetch-standard-forbid-response-header-name-as-set-cookie-1-2