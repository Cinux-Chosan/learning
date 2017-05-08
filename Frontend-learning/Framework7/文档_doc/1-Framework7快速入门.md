# Framework7快速入门

## 给页面添加js初始化代码的三种方式：
- 推荐方式：直接在myApp对象上给about页面进行初始化

        myApp.onPageInit('about', function (page) {
          // Do something here for "about" page          
        })

- 在document上对所有页面初始化，即通过事件函数的参数e来判断具体是哪个页面

        $$(document).on('pageInit', function (e) {
          // Get page data from event data
          var page = e.detail.page;

          if (page.name === 'about') {
            // Following code will be executed for page with data-page attribute equal to "about"
            myApp.alert('Here comes About page');
          }
        })

- 在document上使用选择器选择出对应的页面，不用在onPageInit事件中判断：

        $$(document).on('pageInit', '.page[data-page="about"]', function (e) {
          // Following code will be executed for page with data-page attribute equal to "about"
          myApp.alert('Here comes About page');  
        })
