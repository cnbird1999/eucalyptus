define([
  './eucadialogview',
  'text!./delete_volume_dialog.html!strip',
  'models/volume',
  'app',
  'backbone',
], function(EucaDialogView, template, Volume, App, Backbone) {
  return EucaDialogView.extend({

    findNameTag: function(model){
      var nameTag = null;
      model.get('tags').each(function(tag){
        if( tag.get('name').toLowerCase() == 'name' ){
          nameTag = tag.get('value');
        };
      });
      return nameTag;
    },

    initialize : function(args) {
      var self = this;
      this.template = template;

      var volume_list = [];
      _.each(args.items, function(vid){
        var nameTag = self.findNameTag(App.data.volume.get(vid));
        console.log("Volume: " + vid + " Name Tag: " + nameTag);
        if( nameTag == null ){
          volume_list.push(vid);
        }else{
          volume_list.push(nameTag);
        }
      });

      this.scope = {
        status: '',
        volumes: volume_list, 

        cancelButton: {
          click: function() {
            self.close();
          }
        },
        deleteButton: {
          click: function() {
              doMultiAction(args.items, App.data.volumes,
                            function(model, options) {
                              options['wait'] = true;
                              model.destroy(options);
                            },
                            'volume_delete_progress', 'volume_delete_done', 'volume_delete_fail');
              self.close();
          }
        },
      }
      this._do_init();
    },
  });
});