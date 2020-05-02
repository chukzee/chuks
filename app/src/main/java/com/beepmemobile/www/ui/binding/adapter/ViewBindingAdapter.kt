package com.beepmemobile.www.ui.binding.adapter

import android.graphics.drawable.Drawable
import android.widget.ImageView
import androidx.databinding.BindingAdapter
import com.squareup.picasso.Picasso

@BindingAdapter(value=["imageUrl", "imageResize" ,"imgeErorrUrl", "imagePlaceholder"], requireAll=false)
fun setImgePropeties(view: ImageView, url: String, errUr: Drawable, placeholder: Drawable, resize: Int) {

    var p = Picasso.get()
        .load(url)
        .centerCrop();

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