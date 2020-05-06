package com.beepmemobile.www.ui.search

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController

import com.beepmemobile.www.databinding.SearchFragmentBinding

class SearchFragment : Fragment() {
    private val model: SearchListViewModel by viewModels()
    private val navController by lazy { findNavController() }

    private var _binding: SearchFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SearchFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = SearchFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        val appBarConfiguration = AppBarConfiguration(navController.graph)
        binding.searchToolbar
            .setupWithNavController(navController, appBarConfiguration)

        super.onViewCreated(view, savedInstanceState)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }
}
