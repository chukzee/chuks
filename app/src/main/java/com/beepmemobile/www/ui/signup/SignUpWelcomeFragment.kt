package com.beepmemobile.www.ui.signup

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import com.beepmemobile.www.data.AuthState

import com.beepmemobile.www.databinding.SignUpWelcomeFragmentBinding
import com.beepmemobile.www.ui.main.MainViewModel
import kotlinx.android.synthetic.main.sign_up_welcome_fragment.view.*

class SignUpWelcomeFragment : Fragment() {
    private val model: SignUpWelcomeViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private var _binding: SignUpWelcomeFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SignUpWelcomeFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpWelcomeFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        binding.signUpWelcomeBtnNext.setOnClickListener {
            authModel.singupStage("", AuthState.AUTH_STAGE_BEGIN)
        }

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
