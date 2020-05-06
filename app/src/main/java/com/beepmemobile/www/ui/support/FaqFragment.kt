package com.beepmemobile.www.ui.support

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController

import com.beepmemobile.www.R
import com.beepmemobile.www.databinding.FaqFragmentBinding

class FaqFragment : Fragment() {

    private val navController by lazy { findNavController() }
    private var _binding: FaqFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = FaqFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FaqFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        val appBarConfiguration = AppBarConfiguration(navController.graph)
        binding.faqToolbar
            .setupWithNavController(navController, appBarConfiguration)

        super.onViewCreated(view, savedInstanceState)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
