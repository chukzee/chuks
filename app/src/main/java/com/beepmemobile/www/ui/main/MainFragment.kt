package com.beepmemobile.www.ui.main

import android.net.wifi.hotspot2.pps.HomeSp
import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.navGraphViewModels
import com.beepmemobile.www.Auth
import com.beepmemobile.www.R
import com.beepmemobile.www.databinding.MainFragmentBinding
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.databinding.HomeFragmentBinding
import com.beepmemobile.www.ui.home.HomeFragmentDirections
import com.beepmemobile.www.ui.signup.SignUpWelcomeFragmentDirections
import kotlinx.android.synthetic.main.home_nav_header.*

class MainFragment : Fragment() {
    private val model: MainViewModel by viewModels()

    private var _binding: MainFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = MainFragment()
    }

    override fun onCreateView(inflater: LayoutInflater,
                              container: ViewGroup?,
                              savedInstanceState: Bundle?): View {

        _binding = MainFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }
}
