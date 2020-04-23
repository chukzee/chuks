package com.beepmemobile.www.ui.upgrade

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.beepmemobile.www.R

class UpgradeFragment : Fragment() {

    companion object {
        fun newInstance() = UpgradeFragment()
    }

    private lateinit var viewModel: UpgradeViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.upgrade_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(UpgradeViewModel::class.java)
        // TODO: Use the ViewModel
    }

}
