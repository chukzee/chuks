package com.beepmemobile.www.ui.binding

import android.annotation.SuppressLint
import android.content.Context
import android.content.DialogInterface
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.appcompat.app.AlertDialog
import com.beepmemobile.www.data.ListItemData
import com.beepmemobile.www.databinding.ListTwoTextRightImageBinding
import com.beepmemobile.www.util.Constant

class SettingsListAdapter (private val cxt: Context) : ArrayAdapter<String?>(cxt, 0) {

    var items = mutableListOf<ListItemData>().also {
        createListData(it)
    }

    enum class Type {
        TYPE_1
    }


    private fun createListData(it: MutableList<ListItemData>) {

        var notification = ListItemData()
        notification.type = Type.TYPE_1.ordinal
        notification.text = Constant.STR_NOTIFICATION
        notification.sub_text = "Vibrate only" //e.g Mute, Vibrate only, Vibrate & Sound

        var geosensing = ListItemData()
        geosensing.type = PersonalProfileSettingsListAdapter.Type.TYPE_1.ordinal
        geosensing.text = Constant.STR_GEOSENSING
        geosensing.sub_text = "Default"

        var location_proximity = ListItemData()
        location_proximity.type = Type.TYPE_1.ordinal
        location_proximity.text = Constant.STR_LOCATION_PROXIMITY
        location_proximity.sub_text = "Default"


        it.add(notification)
        it.add(geosensing)
        it.add(location_proximity)

    }

    @SuppressLint("ViewHolder")
    override fun getView(
        position: Int,
        view: View?,
        parent: ViewGroup
    ): View {

        var listViewItem = ListTwoTextRightImageBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )

        listViewItem.item = items[position]

        listViewItem.root.setOnClickListener {

            val item = items[position]

            if(item.text == Constant.STR_NOTIFICATION){
                handleNotification()
            }

            if(item.text == Constant.STR_LOCATION_PROXIMITY){
                handleLocationProximity()
            }

            if(item.text == Constant.STR_GEOSENSING){
                handleGeosensing()
            }

        }

        return listViewItem.root
    }

    private fun handleGeosensing() {
        val builder = AlertDialog.Builder(this.cxt)
        // Set the dialog title
        builder.setTitle("Geosensing")
            .setMessage("TODO")


        builder.create()
        builder.show()
    }

    private fun handleLocationProximity() {

        val builder = AlertDialog.Builder(this.cxt)
        // Set the dialog title
        builder.setTitle("Location Proximity")
            .setMessage("TODO")


        builder.create()
        builder.show()
    }

    private fun handleNotification() {
        val arr = arrayOf<String>("Mute","Vibrate Only","Vibrate & Sound")

        val builder = AlertDialog.Builder(this.cxt)
        // Set the dialog title
        builder.setTitle("Notification")
            .setSingleChoiceItems(arr, 0, //TODO Set the checked item
                DialogInterface.OnClickListener { dialog, which ->

                })


        builder.create()
        builder.show()
    }

    // Returns the number of types of Views that will be created by getView(int, View, ViewGroup)
    override fun getViewTypeCount(): Int {
        // Returns the number of types of Views that will be created by this adapter
        // Each type represents a set of views that can be converted

        return Type.values().size
    }

    // Get the type of View that will be created by getView(int, View, ViewGroup)
    // for the specified item.
    override fun getItemViewType(position: Int): Int {
        // Return an integer here representing the type of View.
        // Note: Integers must be in the range 0 to getViewTypeCount() - 1
        return items[position].type
    }

    override fun getCount(): Int {
        return items.size
    }

}