package com.beepmemobile.www.ui.upgrade

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.beepmemobile.www.R
import com.beepmemobile.www.databinding.UpgradeFragmentBinding

class UpgradeFragment : Fragment() {

    private var _binding: UpgradeFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = UpgradeFragment()
    }

    private lateinit var viewModel: UpgradeViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = UpgradeFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(UpgradeViewModel::class.java)
        // TODO: Use the ViewModel
    }

}
