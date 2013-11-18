var app = {};

app.GlobalOpt = Backbone.Model.extend({
    defaults: {
    }
});

app.GlobalOptView = Backbone.View.extend({
    template: $("script#global-settings-tmpl").html(),

    events: {
        "click #global_save_changes" : "saveChanges",
        "change input"               : "enableButton",
        "change select"              : "enableButton"
    },

    initialize: function() {
        _.bindAll(this, 'render', 'saveChanges', 'enableButton');
        this.model.bind('change', this.render);
        this.model.bind('reset', this.render);
    },

    render: function() {
        var html = _.template(this.template, this.model.toJSON());
        $(this.el).html(html);
        $(this.el).find('input[type="number"]').inputNumber();
        return $(this.el);
    },

    saveChanges: function(ev) {
        this.model.set({
            'hotkey'     : $(this.el).find('#hotkey').val(),
            'max_len'    : $(this.el).find('#global_max_len').val(),
            'gen_method' : $(this.el).find('#global_gen_method').val(),
            'cost'       : $(this.el).find('#global_cost').val()
        });

        chrome.storage.sync.set({'global_options': this.model.toJSON()});
        $(this.el).find('#global_save_changes').attr('disabled', true);
    },

    enableButton: function(ev) {
        $(this.el).find('#global_save_changes').removeAttr('disabled');
    }
});

app.Opt = Backbone.Model.extend({
    defaults: {
        'max_len'    : 32,
        'gen_method' : 'base64'
    }
});

app.OptList = Backbone.Collection.extend({
    model: app.Opt
});


app.OptSimpleView = Backbone.View.extend({
    tagName: 'li',
    className: 'opt-simple-view',
    template: $("script#opt-simple-view-tmpl").html(),
    
    events: {
        'click'      : 'clickItem'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'clickItem', 'selectOpt', 'destroy');
        this.model.bind('change', this.render);
        this.model.bind('reset', this.render);
        this.model.bind('destroy', this.destroy);
        this.bind('select:opt', this.selectOpt);
        app.globalController.register(this);
    },

    render: function() {
        var html = _.template(this.template, this.model.toJSON());
        return $(this.el).html(html);
    },

    clickItem: function(ev) {
        app.globalController.trigger("select:opt", this.model, $(this.el).position(), $(this.el).outerWidth());
    },

    selectOpt: function(opt) {
        if (opt === this.model) {
            $(this.el).addClass('selected');
        } else {
            $(this.el).removeClass('selected');
        }
    },

    destroy: function(opt) {
        this.remove();
    }
});

app.OptExpandedView = Backbone.View.extend({
    tagName: 'div',
    className: 'opt-expanded-view',
    template: $("script#opt-expanded-view-tmpl").html(),

    events: {
        'click #delete_opt_btn' : 'clickDelete',
        'change input'          : 'enableSave',
        'change select'         : 'enableSave'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'clickDelete', 'syncDestroy', 'enableSave');
        this.model.bind('change', this.render);
        this.model.bind('reset', this.render);
    },

    render: function() {
        var html = _.template(this.template, this.model.toJSON());
        $(this.el).html(html);
        return $(this.el);
    },

    clickDelete: function(ev) {
        app.globalController.trigger("delete:opt", this.model);
        this.enableSave();
    },

    syncDestroy: function() {
        this.model.set({
            "cost"       : $(this.el).find('#cost').val(),
            "gen_method" : $(this.el).find('#gen_method').val(),
            "max_len"    : $(this.el).find('#max_len').val(),
        });
        this.remove();
    },

    enableSave: function(ev) {
        app.globalController.trigger("enable:save");
    }
});

app.OptListView = Backbone.View.extend({
    template: $("script#opt-list-view-tmpl").html(),

    events: {
        'keypress #new-salt' : 'addItem',
        'click #optlist_save_changes' : 'saveChanges'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'addItem', 'appendItem', 'saveChanges', 'enableSave', 'disableSave');
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.appendItem);
        this.bind('enable:save', this.enableSave);
        this.bind('disable:save', this.disableSave);
        app.globalController.register(this);
    },

    render: function() {
        $(this.el).html(_.template(this.template));
        this.collection.each(this.appendItem);
    },
    
    appendItem: function(item) {
        var view = new app.OptSimpleView({model: item});
        $(this.el).find('#opts-list').append($(view.render()));
    },
    
    addItem: function(ev) {
        if (ev.keyCode === 13 /* ENTER */) {
            var opt = new app.Opt({
                name: $(ev.currentTarget).val(),
                'cost'       : app.globalOpt.toJSON()['cost'],
                'max_len'    : app.globalOpt.toJSON()['max_len'],
                'gen_method' : app.globalOpt.toJSON()['gen_method']
            });
            this.collection.add(opt);
            $(ev.currentTarget).val("");
            this.enableSave();
        }
    },

    saveChanges: function(ev) {
        app.globalController.trigger("save:opts");
    },

    enableSave: function() {
        $(this.el).find('#optlist_save_changes').removeAttr('disabled');
    },

    disableSave: function() {
        $(this.el).find('#optlist_save_changes').attr('disabled', true);
    }
});

app.GlobalController = GlobalController.extend({
    events: {
        "select:opt" : "selectOpt",
        "delete:opt" : "deleteOpt",
        "save:opts"  : "saveOpts"
    },
    
    initialize: function() {
        _.bindAll(this, 'selectOpt', 'deleteOpt', 'saveOpts');
    },
    
    selectOpt: function(opt, pos, width) {
        if (opt == null || typeof(opt) === "undefined")
            return;
        if (typeof(app.detailView) !== 'undefined' && app.detailView != null) {
            /* destroy */
            app.detailView.syncDestroy();
        }

        app.detailView = new app.OptExpandedView({
            model: opt
        });

        $(app.detailView.render()).appendTo("body").css({
            position: "absolute",
            top: pos.top + "px",
            left: (pos.left + width + 20) + "px"
        }).find('input[type="number"]').inputNumber();
    },
    
    deleteOpt: function(opt) {
        if (typeof(app.detailView) !== 'undefined' && app.detailView != null) {
            app.detailView.remove();
            app.detailView = null;
        }

        opt.destroy();
    },

    saveOpts: function() {
        if (typeof(app.detailView) !== 'undefined' && app.detailView != null) {
            app.detailView.syncDestroy();
            app.detailView = null;
        }

        app.globalController.trigger('select:opt', null);

        var coll = {};

        app.optList.forEach(function(opt) {
            coll[opt.toJSON().name] = _.omit(opt.toJSON(), 'name');
        });
        chrome.storage.sync.set({'salt_options': coll});
        app.globalController.trigger('disable:save');
    }
});

$(function() {
    app.optList = new app.OptList();
    app.globalOpt = new app.GlobalOpt();

    app.globalController = new app.GlobalController();

    var view = new app.OptListView({
        el: $("#opts"),
        collection: app.optList
    });

    var view = new app.GlobalOptView({
        el: $("#global-opts"),
        model: app.globalOpt
    })

    chrome.storage.sync.get(null, function(items) {
        console.log("hiho");
        console.dir(items);
        var props = [];
        _.each(items.salt_options, function(val, key) {
            props.push(_.extend({"name" : key}, val));
        });
        app.optList.reset(props);

        app.globalOpt.set(items.global_options);
    });
});
