package com.beepmemobile.www.ui.signup

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.beepmemobile.www.R
import com.beepmemobile.www.databinding.SignUpUsernameFragmentBinding

class SignUpUsernameFragment : Fragment() {

    private var _binding: SignUpUsernameFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SignUpUsernameFragment()
    }

    private lateinit var viewModel: SignUpUsernameViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpUsernameFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(SignUpUsernameViewModel::class.java)
        // TODO: Use the ViewModel
    }

}
