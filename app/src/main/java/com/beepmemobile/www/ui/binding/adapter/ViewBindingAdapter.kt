package com.beepmemobile.www.ui.binding.adapter

import android.graphics.drawable.Drawable
import android.widget.ImageView
import androidx.databinding.BindingAdapter
import com.squareup.picasso.Picasso

/**
 * READ!! AVOID THIS DANGEROUS MISTAKE!
 * Make sure the parameter type matches the expected type provided in the binding layout. Otherwise
 * the binding error it will produce will be so frustrating to you.
 * So if the expected type in the layout is Drawable for a custom attribute of say 'imagePlaceholder'
 * and in the binding method of this BindingAdapter you provide a String type, the compiler will
 * fail with a binding error of the 'binding class implementation not found'
 * e.g CallListItemImpl not found
 * So look carefully if the array of parameters in the BindingAdapater annotation correspond with the 
 * type expected in the binding method parameter starting from the parameter next to the view 
 * parameter (which of course is not provided in the annotation value array of binding attributes)
 *
 */
@BindingAdapter(value=["imageUrl" ,"imageErrorUrl", "imagePlaceholder", "imageResize"], requireAll=false)
fun setImagePropeties(view: ImageView, url: String, errUr: Drawable?, placeholder: Drawable?, resize: Int) {

    var p = Picasso.get()
        .load(url)
        /*.centerCrop()*/ //NOTE: centerCrop will require setting imageResize variable
                            // otherwise Picasso will throw IllegalState Exception

    if(errUr!=null){
        p.error(errUr)
    }

    if(placeholder!=null){
        p.placeholder(placeholder)
    }

    if(resize > 0){
        p.resize(resize, resize)
    }

    p.into(view)

}